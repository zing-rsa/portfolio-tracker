-- Custom SQL migration file, put your code below! --

CREATE INDEX idx_transactions_ident_type ON transactions (ident, "type", "timestamp");
CREATE INDEX idx_prices_symbol_timestamp ON prices (symbol, "timestamp");