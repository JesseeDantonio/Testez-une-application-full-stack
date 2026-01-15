-- Nettoyage pour éviter les duplications si besoin
DELETE FROM USERS;

INSERT INTO USERS (id, email, last_name, first_name, password, admin, created_at, updated_at)
VALUES (
           1,
           'yoga@studio.com',
           'Admin',
           'Admin',
           '$2a$10$Hsa/zjUvAhiq0tp9xiMeeWmnZxrZ5pQRzddUXE/WjDu2ZThe6Iq', -- bcrypt hash
           TRUE,
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
       );

-- Ajoute d'autres users si besoin pour tes tests
INSERT INTO USERS (id, email, last_name, first_name, password, admin, created_at, updated_at)
VALUES (
           2,
           'user@studio.com',
           'Doe',
           'John',
           '$2a$10$HASHPOURUSER',
           FALSE,
           CURRENT_TIMESTAMP,
           CURRENT_TIMESTAMP
       );