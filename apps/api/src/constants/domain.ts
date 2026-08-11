export const roles = ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] as const;
export type Role = (typeof roles)[number];

export const customerTypes = ['RETAIL', 'WHOLESALE', 'DISTRIBUTOR'] as const;
export type CustomerType = (typeof customerTypes)[number];

export const customerStatuses = ['LEAD', 'ACTIVE', 'INACTIVE'] as const;
export type CustomerStatus = (typeof customerStatuses)[number];
