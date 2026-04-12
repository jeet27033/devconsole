export const DUMMY_DATABASES = [
  { key: 'glue', label: 'glue', value: 'glue' },
  { key: 'admin', label: 'admin', value: 'admin' },
  { key: 'local', label: 'local', value: 'local' },
  { key: 'loyalty', label: 'loyalty', value: 'loyalty' },
];

export const DUMMY_COLLECTIONS = {
  glue: [
    { key: 'users', label: 'users', value: 'users' },
    { key: 'sessions', label: 'sessions', value: 'sessions' },
    { key: 'events', label: 'events', value: 'events' },
  ],
  admin: [
    { key: 'system.users', label: 'system.users', value: 'system.users' },
    { key: 'system.version', label: 'system.version', value: 'system.version' },
  ],
  local: [
    { key: 'startup_log', label: 'startup_log', value: 'startup_log' },
  ],
  loyalty: [
    { key: 'members', label: 'members', value: 'members' },
    { key: 'transactions', label: 'transactions', value: 'transactions' },
    { key: 'rewards', label: 'rewards', value: 'rewards' },
  ],
};

export const DUMMY_QUERY_RESPONSE = `{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "age": 25,
  "email": "john.doe@example.com",
  "createdAt": "2026-01-15T10:30:00Z"
}`;

export const MAX_QUERY_TABS = 10;
