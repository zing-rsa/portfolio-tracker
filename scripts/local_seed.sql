
INSERT INTO prices (price, timestamp, symbol) VALUES
(29000.00, '2025-01-15', 'BTC'),
(1800.00, '2025-01-15', 'ETH'),
(0.07, '2025-01-15', 'DOGE'),
(0.35, '2025-01-15', 'ADA'),
(0.00001, '2025-01-15', 'SHIB'),
(235.00, '2025-01-15', 'SOL'),
(230.00, '2025-01-15', 'BNB'),
(29050.00, '2025-01-16', 'BTC'),
(1850.00, '2025-01-16', 'ETH'),
(0.08, '2025-01-16', 'DOGE'),
(0.43, '2025-01-16', 'ADA'),
(0.000011, '2025-01-16', 'SHIB'),
(240.00, '2025-01-16', 'SOL'),
(235.00, '2025-01-16', 'BNB'),
(89050.00, '2025-01-17', 'BTC'),
(2850.00, '2025-01-17', 'ETH'),
(1.08, '2025-01-17', 'DOGE'),
(0.71, '2025-01-17', 'ADA'),
(0.001011, '2025-01-17', 'SHIB'),
(1240.00, '2025-01-17', 'SOL'),
(2235.00, '2025-01-17', 'BNB');

INSERT INTO prices (price, timestamp, symbol, price_quoted_symbol) VALUES 
(1000, '2025-01-16', 'SPACEBUD', 'ADA');

-- Insert data into trades
INSERT INTO public.trades (buy_qty, buy_symbol, sell_qty, sell_symbol, address) VALUES
(100.5, 'BTC', 3000.75, 'ADA', '1A2b3C4d5E6f7G8h9I0j'),
(50.0, 'ETH', 1250.25, 'ADA', '3F4g5H6i7J8k9L0m1N2o'),
(200.0, 'DOGE', 25.5, 'ETH', '2B3c4D5e6F7g8H9i0J1k'),
(0.005, 'BTC', 100.0, 'USDT', '5E6f7G8h9I0j1A2b3C4d'),
(300.0, 'ADA', 500.0, 'XRP', '9I0j1A2b3C4d5E6f7G8h'),
(1.5, 'ETH', 100.0, 'DAI', '7G8h9I0j1A2b3C4d5E6f'),
(5000.0, 'SHIB', 150.0, 'USDT', '6F7g8H9i0J1k2L3m4N5o'),
(0.25, 'BTC', 10000.0, 'DOGE', '4D5e6F7g8H9i0J1k2L3m'),
(1200.0, 'SOL', 2400.0, 'ADA', '2B3c4D5e6F7g8H9i0J1k'),
(2.0, 'BNB', 750.0, 'USDT', '3F4g5H6i7J8k9L0m1N2o');

-- Insert data into transfers
INSERT INTO public.transfers (sender, receiver, qty, symbol) VALUES
('1A2b3C4d5E6f7G8h9I0j', '3F4g5H6i7J8k9L0m1N2o', 50.0, 'BTC'),
('3F4g5H6i7J8k9L0m1N2o', '2B3c4D5e6F7g8H9i0J1k', 10.0, 'ETH'),
('2B3c4D5e6F7g8H9i0J1k', '5E6f7G8h9I0j1A2b3C4d', 100.0, 'DOGE'),
('5E6f7G8h9I0j1A2b3C4d', '9I0j1A2b3C4d5E6f7G8h', 0.01, 'BTC'),
('9I0j1A2b3C4d5E6f7G8h', '7G8h9I0j1A2b3C4d5E6f', 2000.0, 'ADA'),
('7G8h9I0j1A2b3C4d5E6f', '6F7g8H9i0J1k2L3m4N5o', 0.5, 'ETH'),
('6F7g8H9i0J1k2L3m4N5o', '4D5e6F7g8H9i0J1k2L3m', 100000.0, 'SHIB'),
('4D5e6F7g8H9i0J1k2L3m', '2B3c4D5e6F7g8H9i0J1k', 500.0, 'DOGE'),
('2B3c4D5e6F7g8H9i0J1k', '3F4g5H6i7J8k9L0m1N2o', 600.0, 'SOL'),
('3F4g5H6i7J8k9L0m1N2o', '1A2b3C4d5E6f7G8h9I0j', 100.0, 'BNB'),
('3F4g5H6i7J8k9L0m1N2o', '1A2b3C4d5E6f7G8h9I0j', 1, 'SPACEBUD');

insert into public.transactions ("timestamp", fees, fees_symbol, "type", ident) values
('2025-01-15', 0, NULL, 'trade', 1),
('2025-01-15', 0, NULL, 'trade', 2),
('2025-01-15', 0, NULL, 'trade', 3),
('2025-01-15', 0, NULL, 'transfer', 1),
('2025-01-15', 0, NULL, 'transfer', 2),
('2025-01-16', 0, NULL, 'trade', 4),
('2025-01-16', 0, NULL, 'transfer', 3),
('2025-01-16', 0, NULL, 'transfer', 4),
('2025-01-16', 0, NULL, 'trade', 4),
('2025-01-17', 0, NULL, 'trade', 5),
('2025-01-17', 0, NULL, 'trade', 6),
('2025-01-17', 0, NULL, 'trade', 7),
('2025-01-17', 0, NULL, 'transfer', 5),
('2025-01-17', 0, NULL, 'transfer', 6),
('2025-01-17', 0, NULL, 'transfer', 7),
('2025-01-17', 0, NULL, 'trade', 8),
('2025-01-17', 0, NULL, 'transfer', 8),
('2025-01-17', 0, NULL, 'transfer', 9),
('2025-01-18', 0, NULL, 'trade', 9),
('2025-01-18', 0, NULL, 'trade', 10),
('2025-01-18', 0, NULL, 'transfer', 10),
('2025-01-18', 0, NULL, 'transfer', 11);