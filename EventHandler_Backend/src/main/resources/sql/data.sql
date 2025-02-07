INSERT INTO Events (name, location, startDate, endDate)
VALUES ('Kutyasétáltatás', 'nagypark', '2021-10-01', '2021-10-01'),
       ('Meeting', 'Zoom', '2024-10-17', '2024-10-17'),
       ('Erasmus', 'Lengyelország', '2024-02-19', '2024-06-30'),
       ('Szülinap', 'Beliș', '2024-07-01', '2024-07-03'),
       ('Meeting', 'Teams', '2024-10-17', '2024-10-17'),
       ('Egyetem', 'UBB', '2024-09-30', '2025-06-30'),
       ('Kocsma', 'Plani', '2024-10-17', '2024-10-17'),
       ('Meeting', 'Zoom', '2024-10-18', '2024-10-18'),
       ('Kutyasétáltatás', 'Iulius', '2024-10-18', '2024-10-18'),
       ('Konferencia', 'Kolozsvár', '2025-02-18', '2025-03-01'),
       ('Workshop', 'Budapest', '2025-03-15', '2025-03-16'),
       ('Koncert', 'Aréna', '2025-04-10', '2025-04-10'),
       ('Kirándulás', 'Mátra', '2025-05-01', '2025-05-03'),
       ('Konferencia', 'Debrecen', '2025-06-20', '2025-06-22'),
       ('Családi nap', 'Balaton', '2025-07-10', '2025-07-12'),
       ('Nyári tábor', 'Tisza', '2025-08-01', '2025-08-07'),
       ('Szüreti bál', 'Villány', '2025-09-25', '2025-09-26'),
       ('Kari vásár', 'Vörösmarty tér', '2025-12-01', '2025-12-24'),
       ('Szilveszter', 'Budapest', '2025-12-31', '2025-12-31');

INSERT INTO Participants (name, email, phoneNumber, event_id)
VALUES ('Kovács János', 'kovacsjanos@yahoo.com', '123456', 1),
       ('Nagy Laci', 'nagylaszlo@gmail.com', '456789', 1),
       ('Kiss Péter', 'kisspeter@outlook.com', '891011', 2),
       ('Szakács Laura', 'laurasz@icloud.com', '121314', 4);

INSERT INTO Users (username, email, password, language, theme, role, enabled)
VALUES ('admin', 'admin@admin.com', '$2a$12$RXee3dQciclmRDUDODzBh.P98tnn5OGXP31R2Trm5rp0HaLSnIglu', 'en', 'light', 'ADMIN', true);
