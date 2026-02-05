INSERT INTO customers (customer_id, created_at) VALUES
('c1', '2025-01-05'),
('c2', '2025-01-10'),
('c3', '2025-02-01')
ON CONFLICT (customer_id) DO NOTHING;

INSERT INTO sessions (session_id, customer_id, session_started_at) VALUES
('s1', 'c1', '2025-01-06'),
('s2', 'c2', '2025-01-11'),
('s3', 'c3', '2025-02-05'),
('s4', 'c1', '2025-02-10')
ON CONFLICT (session_id) DO NOTHING;

INSERT INTO orders (order_id, customer_id, order_date, amount) VALUES
('o1', 'c1', '2025-01-07', 120.00),
('o2', 'c2', '2025-01-15', 80.00),
('o3', 'c1', '2025-02-12', 150.00)
ON CONFLICT (order_id) DO NOTHING;
