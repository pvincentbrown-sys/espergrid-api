const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const skills = {
  'hubspot-deal-extractor': () => ({ company_name: 'Test Company', deal_amount: 5000.00, contact_email: 'test@example.com', line_items: [{ description: 'Service', amount: 5000.00 }], status: 'success' }),
  'stripe-revenue-monitor': () => ({ daily_revenue: 12500.00, transaction_count: 47, anomalies: [], status: 'healthy' }),
  'quickbooks-pl-generator': () => ({ revenue: 50000.00, expenses: 32000.00, net_income: 18000.00, period: 'Q1 2026' }),
  'contract-review-checklist': () => ({ clauses_found: ['indemnification', 'limitation of liability', 'governing law'], missing_clauses: ['non-compete'], risk_flags: [], status: 'reviewed' }),
  'legal-intake-triage': () => ({ practice_area: 'contract dispute', urgency: 'medium', client_name: 'Test Client', opposing_party: 'Test Opposing Party' }),
  'court-date-tracker': () => ({ upcoming_deadlines: [], reminders_sent: 0, status: 'monitoring' }),
  'construction-comm-manager': () => ({ project_status: 'phase_complete', notifications_sent: 3, stakeholders_notified: ['client', 'subcontractor', 'supplier'] }),
  'healthcare-appointment-coordinator': () => ({ appointments_today: 12, reminders_sent: 8, no_shows_flagged: 1, status: 'active' }),
  'zendesk-linear-triage': () => ({ tickets_processed: 5, linear_issues_created: 3, status: 'complete' }),
  'typeform-notion-sync': () => ({ responses_synced: 7, database_updated: true, status: 'complete' })
};

// Handle HEAD requests for preflight checks
app.head('/api/:skill', (req, res) => {
  if (skills[req.params.skill]) return res.sendStatus(200);
  res.sendStatus(404);
});

app.post('/api/:skill', (req, res) => {
  const handler = skills[req.params.skill];
  if (!handler) return res.status(404).json({ error: `Skill '${req.params.skill}' not found` });
  res.json({ output: handler(req.body?.input || {}) });
});

app.get('/api', (req, res) => res.json({ service: 'Espergrid Unified API', skills: Object.keys(skills) }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Espergrid API running on port ${PORT}`));
