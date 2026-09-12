-- ==========================================================
-- DASTARKHWAN SEED DATA: PAKISTANI LUXURY RESTAURANT
-- Branch: DHA Phase 8, Creek Avenue, Karachi
-- ==========================================================

-- 1. RESTAURANT SETTINGS
INSERT INTO public.restaurant_settings (
  restaurant_name,
  branch_name,
  branch_address,
  phone,
  email,
  tax_rate_percent,
  delivery_fee_pkr,
  min_delivery_order_pkr,
  max_reservation_guests,
  reservation_slot_duration_minutes,
  is_online_ordering_enabled,
  is_reservations_enabled
) VALUES (
  'Dastarkhwan',
  'Karachi Flagship Haven',
  'Plot 14-C, Creek Avenue, Phase 8, DHA, Karachi, Pakistan',
  '+92 21 3584 9200',
  'concierge@dastarkhwan.pk',
  5.00,
  250,
  1000,
  25,
  120,
  true,
  true
) ON CONFLICT DO NOTHING;

-- 2. RESTAURANT OPERATING HOURS
INSERT INTO public.restaurant_hours (day_of_week, open_time, close_time, is_closed, notes)
VALUES
  (0, '12:00:00', '01:30:00', false, 'Sunday Imperial Banquet'),
  (1, '12:00:00', '01:30:00', false, 'Monday Lunch & Dinner'),
  (2, '12:00:00', '01:30:00', false, 'Tuesday Lunch & Dinner'),
  (3, '12:00:00', '01:30:00', false, 'Wednesday Lunch & Dinner'),
  (4, '12:00:00', '01:30:00', false, 'Thursday Lunch & Dinner'),
  (5, '12:00:00', '02:00:00', false, 'Friday Jummah Special & Late Night'),
  (6, '12:00:00', '02:00:00', false, 'Saturday Royal Banquet')
ON CONFLICT (day_of_week) DO NOTHING;

-- 3. RESTAURANT TABLES (DHA PHASE 8 BRANCH)
INSERT INTO public.restaurant_tables (table_number, capacity, location_area, is_active)
VALUES
  ('Table 1', 4, 'main_dining', true),
  ('Table 2', 4, 'main_dining', true),
  ('Table 3', 6, 'main_dining', true),
  ('Table 4', 6, 'main_dining', true),
  ('Majlis A (Shahi Room)', 8, 'family_majlis', true),
  ('Majlis B (Zeenat Room)', 10, 'family_majlis', true),
  ('Majlis C (Babur Courtyard)', 14, 'family_majlis', true),
  ('Terrace 1', 2, 'sea_breeze_terrace', true),
  ('Terrace 2', 4, 'sea_breeze_terrace', true),
  ('Terrace 3', 4, 'sea_breeze_terrace', true),
  ('Diwan Khas (VIP)', 16, 'private_diwan', true)
ON CONFLICT (table_number) DO NOTHING;

-- 4. CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Dum Pukht & Biryani', 'dum-pukht-biryani', 'Slow-sealed earthen pot deghs, pure saffron basmati, and delicate silver vark.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlzZP_MA9_GUaWyyjPmwL2M3cmcWaM1EJ7-pmPr9Qn2SJmrTYnjhFN6RSJnmRY7fNRufwl7F5NN6AP7tvAzn2B2HxPC7j0QvWPqrV_NElAGvL3dEDWKYTunzo9IZi5dx--23tX3rfBZKoOHs3nFTStverfVpvQnA8kRXFb-TJ_H1o8DXqcopqy7xtvmpqozmgdvOWueQFmkvdxnl7Y28tohp0NxuCHMiLh8tOgpAC1DuQxcDMOLGzI', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Shinwari & Karahi', 'shinwari-karahi', 'Fresh meat seared in cold-pressed mustard oil with fresh Roma tomatoes & black pepper.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqQh3xSuHS26e4JcxJiTyX1eiPBs9sqvmrMbC9VU24Rj0fyULV_QCRyVgYsBbrXvFoKrhE4h0GJ0fmcAyB17Ec3AFhaOxSFSytjlKSbhIXFTcdL4Oom3gis_r8wuvl41nwVM6h4Ph5KdIdhug2pvNZa_myKZxy7KulPM1FkjJETM43CRA0Ss7EIYm4lcuNydkfaBqdSvJVD4LKVXCksZrAwQW6oTj8BWVuO55Ehvz94HoA09AgMNei', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Angara BBQ & Seekh', 'angara-bbq-seekh', 'Char-grilled chops, melt-in-mouth Peshawar chapli kebabs, and tender seekh skewers.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkhEXfojBPjWWjSLDODcX71sXPTuAXMW7az_jJQumdgI22IuDluoHgTSPgKSp5ZjIvLVMrHvuyz1zGPQ3tXLmL7TJVdlsjshPLnhs0CRRXCrmuQDwfyUnss1N1EhD1REcZV9QaJ0lv22-agA6kLuQXadZCy7eXHmqOflY2Ua9frObAaUpX6FLxRxCil2ZeAGxZH-EcdIKMYbVbh4dUcWvJnp2ZRTdEfyREYSUA_7XgsjJpYbH8LWA4', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Nihari & Paya', 'nihari-paya', 'Velvety slow-simmered shanks with rich bone marrow and aromatic heirloom potlis.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4oL893LSjQEiyhVRaSQx3XYJc_WvTMPLUi81leHzy1tmh_6OTyDMvjET3LksFpvXjlWh6tNgsQGy1-EXaC_woXXc4JeBmcmpIKgFo7-iiZEYkBCDSuWOme5eKNR8fJcETbJrTWaTu_J8tzofyG1v81UYZnGgGHzFfvic-rVD-xYlGlxRb5uCyc6B4_K0wQ87gMdi1mch5miCflvITEQL5tJ28YZICW03HN-1lzW_tDvyRScZB444G', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Tandoor & Roghani Naan', 'tandoor-naan', 'Roghni, sesame-crusted taftan, and crisp garlic coriander naan hot from clay hearths.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOHvX7qwtMQ4ytZczPYWhua0rOLN2awqHPTuvzj3UwMSgtOWDS1MB4Ndgt32vgyt_auQTpJN9no8wvFdTSFWdH-gSSXEhBPNhUsN3XYKl6zF7N2Ve8tl7yVcc-AjUuNh-m_E1R_awZEq2gG2M_y3O7YLfLsX_Rjj8aJEspSvT_V5C2Cf3jOhrOqnJFu7MEzZhCqtcizWaFUgrh3z_IbvWpElNjyC4JWI2QTOQN4Y5H8FnFxN88p-il', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Mithai & Desserts', 'mithai-desserts', 'Shahi Tukray with thickened rabri, Matka Kheer Khas, and house-churned Zafrani Kulfi.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5OibuuFyF62YmcxshkQ_DOovnbSrrM_fz4nf8lWsr3VR2NLPdnLQ3gvF4eHlEOKRD-pKbJVoSii6PLQ6qoAKMmo8uNLQUsKn6vvm-nU36Z7QnGcedzVochDTZeca_gItNstr2WU5lkxJATaPtdOC5TAZiDeubXhQbb-ftZ9vutWI2_gu-SzO8lcR2tE5POCYPiZmnYW02VGhtQVZWAXPC56zIWpp-HqTnCe-7bmIvDGphEtxaVbk3', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 5. MENU ITEMS
INSERT INTO public.menu_items (
  id, category_id, name, slug, description, price, image_url, origin_badge, portion_info,
  dietary_tags, spice_level, preparation_time_minutes, is_available, is_featured, rating, review_count
) VALUES
  (
    'm1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Shahi Dum Pukht Mutton Biryani',
    'shahi-dum-pukht-mutton-biryani',
    'Fragrant aged basmati simmered in slow mutton broth with pure saffron, whole cardamom, golden almonds, and edible silver vark.',
    2450,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDqeFKzY7qNSTOOChjcFvrTQ3yGccNkayNLgmIdZbUcky-Emx3_fhI000n6PW8l3FDOY2hz_kPa_3WvHad-ENYc8THNA1DrmWx346UrX3zRJPe45hVzTJ8fVDGSxrKzPrEpCdWRQuv5bon7lxy7jNU71cv9IRiz3dxi1id79vzZbj9eCPa9MKlp7bMKFiew1fHd92py8IjQH-yRm-iWqP3vKlPnSTh0LbMT2uPJZJRo1rTUAehsaNG9',
    'Khyber Special',
    'Feeds 2 Guests',
    ARRAY['Halal', 'Chef''s Signature'],
    2,
    35,
    true,
    true,
    4.9,
    420
  ),
  (
    'm1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'Lahori Desi Murgh Karahi',
    'lahori-desi-murgh-karahi',
    'Free-range organic chicken prepared in cold-pressed mustard oil with ripe Roma tomatoes, roasted coriander seeds, and ginger slivers.',
    2150,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDXe2D9yFFQPaTs03f5e6X1npMF3dhAaKlXhA4FvkIu64uwJkk8vTQbov5FPA8okEv85vFmGK7BxwnC9oigTLiy2gVK81k-1STUSIO_tJzXx9Rg4jPmhrzvZ6KWmNw2Febd1QqEuhUk5olUssnrPWK7J51L9iO6bmBnwHk_YN0k2QNiC0ff_AMojq3HC5F5zONVEwM90rZxmvTfi9sz2OqqdTJE2AgUtZXygcj-jz0MoxFmyq8ylHSk',
    'Lahore Gawalmandi',
    '1 KG Full Deg',
    ARRAY['Halal', 'Organic Desi Murgh'],
    3,
    30,
    true,
    true,
    4.8,
    380
  ),
  (
    'm1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000003',
    'Charsi Tikka & Lamb Chops',
    'charsi-tikka-lamb-chops',
    'Tender salt-cured lamb chops seared over acacia embers, served with charred Roma tomatoes, podina raita, and lemon wedges.',
    2890,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuALL-IIEZS8YDp5lZv_obJFca1V6ErL6hbYNkqSU_P6WqAfkSENL0bPwuz6Du7Lqm1tmseATYB678PTLM_I7LU6JW0EZIoQEDRzkaHe9Ecwkv7BJmuUNK6OlCSGYwfPKMrYrEIXkAQePMJ4KkON0DTgfTWhKyATlLBevaDGZH2KYouZ7DVfwhdF-YxC5zXcbfOtJo8uql6nTW_IAFFolwYw1-2OEb5tHCp5kjGY7pR6wGra3cOBsDMM',
    'Peshawar Namak Mandi',
    '6 Chops • Feeds 2',
    ARRAY['Halal', 'Salt Cured BBQ'],
    1,
    25,
    true,
    true,
    5.0,
    210
  ),
  (
    'm1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000004',
    'Nalli Nihari Khas',
    'nalli-nihari-khas',
    'Velvety slow-stewed prime beef shank infused with 32 secret spices, served with generous sizzling bone marrow butter and crispy ginger.',
    2250,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuATWGk_pIAn4sfJrrpBBCR03oEZ-zVVa8h1lEk3PCR2n7eW6AEBXerErmg3317aqSYgiutWL9pEJ-hbakK3NWo4msTFUzcJMbVs19yyj_G8yABxAG6YvOVvzO21s5YXY_Qxe5qVIFo5RcYSTI9EhZrvUEIuti6vzSTYqpZNq2-M2mEYRKoKQkzZl9E__yeO4aM5zvGHKWHtIP1DCcUXwTl0BjiMlBYdqKDgvx5-grTka8yTFakj3rWb',
    'Royal Mughal Court',
    'Double Shank + Marrow',
    ARRAY['Halal', 'Heirloom Gravy'],
    4,
    20,
    true,
    true,
    4.9,
    512
  ),
  (
    'm1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000002',
    'Shinwari Mutton Dumba Karahi',
    'shinwari-mutton-dumba-karahi',
    'Grass-fed Khyber Dumba mutton cooked exclusively in its own fat with organic sea salt, crushed tomatoes, and charred green chilies.',
    3200,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA74W8uGN4fBmq3ose7eKrUfq2_4TSTmCSfHtJJld8B_8ZNM6Tq8n5z5jY030bTkrQiPLSgaomskbpfTpsoMBRQpd_jvQaL9jLC0k74Ei5fBCRCmfJVr8JZbOlKULKYMLxi1nvSnfzA7B28XA3BpGtqpnvqzLZgG98XkExEWLYX0zVeDAnWRq54xRPwdCIdHr4jdtp1mPjsODiR2GNASRcGK5t_bDHvIMFa7d9awPj8SvXrBiLbYQ8-',
    'Landi Kotal',
    '1 KG Dumba',
    ARRAY['Halal', 'Pure Dumba Fat'],
    2,
    40,
    true,
    false,
    4.9,
    195
  ),
  (
    'm1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000005',
    'Shahi Roghani Naan',
    'shahi-roghani-naan',
    'Clay tandoor leavened bread brushed generously with pure Desi Ghee, sprinkled with white sesame seeds and kalonji.',
    220,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDWL3gI4gjnzB3_UJ6ZvQkeshcqYOMJ6RbqFA59qvlhMKDHeWEFHp15xRDNutNMJWPsMZGh4IMNV1a5AjWvDpCcyEkF9Qs3_72uImCssWgSdmRBG-SfvDEno85aXHqUPMlqRhc-pA5-vAo9kOarnG6l7zCUk05LOJnzDFO1CvanGM90xpMEvRJ5NbDCe5fLo1pNgdzFlC4MsgvDcFWQtyOtMpoQKZUbKgfnsXR7S4xGrYJW0kGOblhU',
    'Clay Hearth',
    '1 Large Naan',
    ARRAY['Vegetarian', 'Desi Ghee'],
    1,
    10,
    true,
    false,
    4.8,
    310
  ),
  (
    'm1000000-0000-0000-0000-000000000007',
    'c1000000-0000-0000-0000-000000000006',
    'Khas Zafrani Matka Kheer',
    'khas-zafrani-matka-kheer',
    'Slow-reduced rich buffalo milk with crushed basmati rice, Iranian saffron, green cardamom, roasted pistachios, and pure silver foil in terracotta bowls.',
    650,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBBTs8Xz-dBwNIVFsgMkiwt03LKraj9UsB1RQYkjLcei36eAiIsKiN5h_Prv6KqMgEoY43RRF-ZIS4tFrRTI3Uz3RLRNL90m21QusSm2LXydi0dt_IRsR7LwMXeforrmXBaoOWcyyEb1meukgqEUBMY2r_7dGe5Zkl7q1rGZjwbGf534JZJtyrYxHSD5JH-WFsY8701XoLbV1mO1Z6gX5qp0v0zhxvf796_v27NSOLTuZmSUlL6lU9_',
    'Mughal Haveli',
    'Serves 1–2',
    ARRAY['Vegetarian', 'Royal Dessert'],
    1,
    5,
    true,
    false,
    4.9,
    280
  )
ON CONFLICT (id) DO NOTHING;

-- 6. COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_amount, valid_from, valid_until, is_active)
VALUES
  ('IMPERIAL10', 'percentage', 10, 1500, now(), now() + INTERVAL '1 year', true),
  ('ROYAL500', 'fixed', 500, 3000, now(), now() + INTERVAL '1 year', true)
ON CONFLICT (code) DO NOTHING;

-- 7. THREE DESIGNATED APPROVED ADMIN ACCOUNTS ASSIGNMENT
-- Run this AFTER the 3 admins have been invited/created via Supabase Dashboard
-- Replace with actual user emails when provisioning:
/*
UPDATE public.profiles
SET role = 'admin'
WHERE email IN (
  'admin.haider@dastarkhwan.internal',
  'admin.bilal@dastarkhwan.internal',
  'admin.tariq@dastarkhwan.internal'
);
*/

