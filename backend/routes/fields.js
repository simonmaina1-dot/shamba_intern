const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');
const router = express.Router();

/* Compute field status based on stage, age, and risk notes */
const getFieldStatus = (field) => {
  const now = new Date();
  const daysSincePlanting = Math.floor((now - new Date(field.plantingDate)) / (1000 * 60 * 60 * 24));
  
  const expectedDays = {
    Planted: 0,
    Growing: 14,
    Ready: 60,
    Harvested: 74
  };
  
  const stageDays = expectedDays[field.currentStage] || 0;
  const riskKeywords = ['pest', 'disease', 'drought', 'risk'];
  const hasRisk = riskKeywords.some(kw => field.notes.toLowerCase().includes(kw));
  
  if (field.currentStage === 'Harvested') return 'Completed';
  if (hasRisk || daysSincePlanting > stageDays + 7) return 'At Risk';
  return 'Active';
};

// GET /api/fields - List fields
router.get('/', auth(['ADMIN', 'AGENT']), async (req, res) => {
  try {
    const where = req.user.role === 'AGENT' ? { agentId: req.user.id } : {};
    const fields = await prisma.field.findMany({
      where,
      include: { agent: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' }
    });
    const fieldsWithStatus = fields.map(field => ({
      ...field,
      status: getFieldStatus(field)
    }));
    res.json(fieldsWithStatus);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/fields - Create field (admin only)
router.post('/', auth(['ADMIN']), async (req, res) => {
  try {
    const field = await prisma.field.create({
      data: req.body,
      include: { agent: { select: { name: true } } }
    });
    res.status(201).json({ ...field, status: getFieldStatus(field) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/fields/:id - Update field
router.put('/:id', auth(['ADMIN', 'AGENT']), async (req, res) => {
  try {
    const fieldId = parseInt(req.params.id);
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) return res.status(404).json({ error: 'Field not found' });

    // Check ownership
    if (req.user.role !== 'ADMIN' && field.agentId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.field.update({
      where: { id: fieldId },
      data: req.body,
      include: { agent: { select: { name: true } } }
    });
    res.json({ ...updated, status: getFieldStatus(updated) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/fields/:id
router.delete('/:id', auth(['ADMIN', 'AGENT']), async (req, res) => {
  try {
    const fieldId = parseInt(req.params.id);
    const field = await prisma.field.findUnique({ where: { id: fieldId } });
    if (!field) return res.status(404).json({ error: 'Field not found' });

    if (req.user.role !== 'ADMIN' && field.agentId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.field.delete({ where: { id: fieldId } });
    res.json({ message: 'Field deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
