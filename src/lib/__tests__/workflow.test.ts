import { describe, it, expect } from 'vitest';
import { workflowRules } from '../automation/workflow';
import { orderStatuses } from '../mock/admin';

describe('workflowRules', () => {
  it('couvre tous les statuts de commande définis', () => {
    orderStatuses.forEach((status) => {
      expect(workflowRules[status.key]).toBeDefined();
    });
  });

  it('chaque règle avec notifyClient a un message client', () => {
    Object.values(workflowRules).forEach((rule) => {
      if (rule.notifyClient) expect(rule.clientMessage.length).toBeGreaterThan(0);
    });
  });
});
