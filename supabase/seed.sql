-- Starter content. Run after 0001_init.sql (SQL Editor -> New query -> paste -> Run).
-- Route paths are approximate; walk each route and adjust the points before relying on them.

insert into public.site_settings (key, value) values
  ('sirkle_join_url', ''),
  ('sirkle_calendar_embed_url', ''),
  ('contact_email', 'hello@neonwalkclub.com'),
  ('instagram_url', ''),
  ('member_count', '350'),
  ('walks_per_week', '5–6')
on conflict (key) do nothing;

insert into public.routes (slug, name, area, color, description, highlights, path, sort_order) values
('center-strip-classic', 'Center Strip Classic', 'Center Strip', '#ff3d9a',
 'Our signature route. Big fountains, the Eiffel Tower and the LINQ Promenade. A great first walk.',
 array['Bellagio Fountains','Paris Las Vegas','The LINQ Promenade','High Roller'],
 '[[36.1022,-115.1727],[36.1058,-115.1726],[36.109,-115.1724],[36.1126,-115.1723],[36.1162,-115.1722],[36.118,-115.1716],[36.1222,-115.1702]]', 1),
('north-strip-neon', 'North Strip Neon', 'North Strip', '#2ee6ff',
 'From the Venetian canals past the Wynn and Resorts World up to the Sahara.',
 array['The Venetian','Fashion Show','Wynn & Encore','Resorts World','Sahara'],
 '[[36.1222,-115.1702],[36.127,-115.169],[36.129,-115.1668],[36.134,-115.164],[36.137,-115.162],[36.1405,-115.1597],[36.144,-115.157]]', 2),
('south-strip-sign', 'South Strip to the Sign', 'South Strip', '#ffc34d',
 'Castles, pyramids and a group photo at the famous Welcome to Las Vegas sign.',
 array['Excalibur','Luxor','Mandalay Bay','Welcome to Las Vegas sign'],
 '[[36.1022,-115.1727],[36.0975,-115.173],[36.0921,-115.1738],[36.0875,-115.1735],[36.082,-115.1728]]', 3),
('full-strip', 'The Full Strip', 'End to end', '#a66bff',
 'The whole boulevard, sign to Sahara. Our long-distance challenge walk.',
 array['Welcome sign','Center Strip','North Strip','Sahara'],
 '[[36.082,-115.1728],[36.0875,-115.1735],[36.0921,-115.1738],[36.0975,-115.173],[36.1022,-115.1727],[36.109,-115.1724],[36.1162,-115.1722],[36.1222,-115.1702],[36.127,-115.169],[36.129,-115.1668],[36.134,-115.164],[36.137,-115.162],[36.144,-115.157]]', 4),
('downtown-neon', 'Downtown Neon', 'Downtown / Fremont', '#5dff9f',
 'A bonus route under the Fremont Street canopy and up to the Neon Museum boneyard.',
 array['Fremont Street Experience','Fremont East','The Neon Museum'],
 '[[36.1716,-115.1466],[36.1706,-115.1452],[36.1696,-115.1437],[36.168,-115.1413],[36.17,-115.1405],[36.174,-115.1375],[36.177,-115.1355]]', 5)
on conflict (slug) do nothing;
