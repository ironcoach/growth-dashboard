CREATE TABLE IF NOT EXISTS customers (
  customer_id TEXT PRIMARY KEY,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  customer_id TEXT,
  session_started_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  customer_id TEXT,
  order_date TIMESTAMP NOT NULL,
  amount NUMERIC(12,2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(session_started_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
