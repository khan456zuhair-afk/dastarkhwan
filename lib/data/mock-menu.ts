export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number; // in PKR
  imageUrl: string;
  originBadge?: string;
  portionInfo?: string;
  spiceLevel: number; // 1 - 4
  rating: number;
  reviewCount: number;
  dietaryTags: string[];
  isFeatured?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  badge?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Dum Pukht & Biryani",
    slug: "dum-pukht-biryani",
    description: "Slow-sealed earthen pot deghs, pure saffron basmati, and delicate silver vark.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlzZP_MA9_GUaWyyjPmwL2M3cmcWaM1EJ7-pmPr9Qn2SJmrTYnjhFN6RSJnmRY7fNRufwl7F5NN6AP7tvAzn2B2HxPC7j0QvWPqrV_NElAGvL3dEDWKYTunzo9IZi5dx--23tX3rfBZKoOHs3nFTStverfVpvQnA8kRXFb-TJ_H1o8DXqcopqy7xtvmpqozmgdvOWueQFmkvdxnl7Y28tohp0NxuCHMiLh8tOgpAC1DuQxcDMOLGzI",
    badge: "Royal Deghs",
  },
  {
    id: "cat-2",
    name: "Shinwari & Karahi",
    slug: "shinwari-karahi",
    description: "Fresh meat seared in cold-pressed mustard oil with fresh Roma tomatoes & black pepper.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBqQh3xSuHS26e4JcxJiTyX1eiPBs9sqvmrMbC9VU24Rj0fyULV_QCRyVgYsBbrXvFoKrhE4h0GJ0fmcAyB17Ec3AFhaOxSFSytjlKSbhIXFTcdL4Oom3gis_r8wuvl41nwVM6h4Ph5KdIdhug2pvNZa_myKZxy7KulPM1FkjJETM43CRA0Ss7EIYm4lcuNydkfaBqdSvJVD4LKVXCksZrAwQW6oTj8BWVuO55Ehvz94HoA09AgMNei",
    badge: "Cast Iron Wok",
  },
  {
    id: "cat-3",
    name: "Angara BBQ & Seekh",
    slug: "angara-bbq-seekh",
    description: "Char-grilled chops, melt-in-mouth Peshawar chapli kebabs, and tender seekh skewers.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkhEXfojBPjWWjSLDODcX71sXPTuAXMW7az_jJQumdgI22IuDluoHgTSPgKSp5ZjIvLVMrHvuyz1zGPQ3tXLmL7TJVdlsjshPLnhs0CRRXCrmuQDwfyUnss1N1EhD1REcZV9QaJ0lv22-agA6kLuQXadZCy7eXHmqOflY2Ua9frObAaUpX6FLxRxCil2ZeAGxZH-EcdIKMYbVbh4dUcWvJnp2ZRTdEfyREYSUA_7XgsjJpYbH8LWA4",
    badge: "Acacia Coal",
  },
  {
    id: "cat-4",
    name: "Nihari & Paya",
    slug: "nihari-paya",
    description: "Velvety slow-simmered shanks with rich bone marrow and aromatic heirloom potlis.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA4oL893LSjQEiyhVRaSQx3XYJc_WvTMPLUi81leHzy1tmh_6OTyDMvjET3LksFpvXjlWh6tNgsQGy1-EXaC_woXXc4JeBmcmpIKgFo7-iiZEYkBCDSuWOme5eKNR8fJcETbJrTWaTu_J8tzofyG1v81UYZnGgGHzFfvic-rVD-xYlGlxRb5uCyc6B4_K0wQ87gMdi1mch5miCflvITEQL5tJ28YZICW03HN-1lzW_tDvyRScZB444G",
    badge: "Marrow Infused",
  },
  {
    id: "cat-5",
    name: "Tandoor & Roghani Naan",
    slug: "tandoor-naan",
    description: "Roghni, sesame-crusted taftan, and crisp garlic coriander naan hot from clay hearths.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOHvX7qwtMQ4ytZczPYWhua0rOLN2awqHPTuvzj3UwMSgtOWDS1MB4Ndgt32vgyt_auQTpJN9no8wvFdTSFWdH-gSSXEhBPNhUsN3XYKl6zF7N2Ve8tl7yVcc-AjUuNh-m_E1R_awZEq2gG2M_y3O7YLfLsX_Rjj8aJEspSvT_V5C2Cf3jOhrOqnJFu7MEzZhCqtcizWaFUgrh3z_IbvWpElNjyC4JWI2QTOQN4Y5H8FnFxN88p-il",
    badge: "Clay Tandoor",
  },
  {
    id: "cat-6",
    name: "Mithai & Desserts",
    slug: "mithai-desserts",
    description: "Shahi Tukray with thickened rabri, Matka Kheer Khas, and house-churned Zafrani Kulfi.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5OibuuFyF62YmcxshkQ_DOovnbSrrM_fz4nf8lWsr3VR2NLPdnLQ3gvF4eHlEOKRD-pKbJVoSii6PLQ6qoAKMmo8uNLQUsKn6vvm-nU36Z7QnGcedzVochDTZeca_gItNstr2WU5lkxJATaPtdOC5TAZiDeubXhQbb-ftZ9vutWI2_gu-SzO8lcR2tE5POCYPiZmnYW02VGhtQVZWAXPC56zIWpp-HqTnCe-7bmIvDGphEtxaVbk3",
    badge: "Royal Sweetmeat",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Shahi Dum Pukht Mutton Biryani",
    slug: "shahi-dum-pukht-mutton-biryani",
    categoryId: "cat-1",
    categoryName: "Dum Pukht & Biryani",
    description:
      "Fragrant aged basmati simmered in slow mutton broth with pure saffron, whole cardamom, golden almonds, and edible silver vark.",
    price: 2450,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqeFKzY7qNSTOOChjcFvrTQ3yGccNkayNLgmIdZbUcky-Emx3_fhI000n6PW8l3FDOY2hz_kPa_3WvHad-ENYc8THNA1DrmWx346UrX3zRJPe45hVzTJ8fVDGSxrKzPrEpCdWRQuv5bon7lxy7jNU71cv9IRiz3dxi1id79vzZbj9eCPa9MKlp7bMKFiew1fHd92py8IjQH-yRm-iWqP3vKlPnSTh0LbMT2uPJZJRo1rTUAehsaNG9",
    originBadge: "Khyber Special",
    portionInfo: "Feeds 2 Guests",
    spiceLevel: 2,
    rating: 4.9,
    reviewCount: 420,
    dietaryTags: ["Halal", "Chef's Signature"],
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 35,
  },
  {
    id: "item-2",
    name: "Lahori Desi Murgh Karahi",
    slug: "lahori-desi-murgh-karahi",
    categoryId: "cat-2",
    categoryName: "Shinwari & Karahi",
    description:
      "Free-range organic chicken prepared in cold-pressed mustard oil with ripe Roma tomatoes, roasted coriander seeds, and ginger slivers.",
    price: 2150,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXe2D9yFFQPaTs03f5e6X1npMF3dhAaKlXhA4FvkIu64uwJkk8vTQbov5FPA8okEv85vFmGK7BxwnC9oigTLiy2gVK81k-1STUSIO_tJzXx9Rg4jPmhrzvZ6KWmNw2Febd1QqEuhUk5olUssnrPWK7J51L9iO6bmBnwHk_YN0k2QNiC0ff_AMojq3HC5F5zONVEwM90rZxmvTfi9sz2OqqdTJE2AgUtZXygcj-jz0MoxFmyq8ylHSk",
    originBadge: "Lahore Gawalmandi",
    portionInfo: "1 KG Full Deg",
    spiceLevel: 3,
    rating: 4.8,
    reviewCount: 380,
    dietaryTags: ["Halal", "Organic Desi Murgh"],
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 30,
  },
  {
    id: "item-3",
    name: "Charsi Tikka & Lamb Chops",
    slug: "charsi-tikka-lamb-chops",
    categoryId: "cat-3",
    categoryName: "Angara BBQ & Seekh",
    description:
      "Tender salt-cured lamb chops seared over acacia embers, served with charred Roma tomatoes, podina raita, and lemon wedges.",
    price: 2890,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALL-IIEZS8YDp5lZv_obJFca1V6ErL6hbYNkqSU_P6WqAfkSENL0bPwuz6Du7Lqm1tmseATYB678PTLM_I7LU6JW0EZIoQEDRzkaHe9Ecwkv7BJmuUNK6OlCSGYwfPKMrYrEIXkAQePMJ4KkON0DTgfTWhKyATlLBevaDGZH2KYouZ7DVfwhdF-YxC5zXcbfOtJo8uql6nTW_IAFFolwYw1-2OEb5tHCp5kjGY7pR6wGra3cOBsDMM",
    originBadge: "Peshawar Namak Mandi",
    portionInfo: "6 Chops • Feeds 2",
    spiceLevel: 1,
    rating: 5.0,
    reviewCount: 210,
    dietaryTags: ["Halal", "Salt Cured BBQ"],
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 25,
  },
  {
    id: "item-4",
    name: "Nalli Nihari Khas",
    slug: "nalli-nihari-khas",
    categoryId: "cat-4",
    categoryName: "Nihari & Paya",
    description:
      "Velvety slow-stewed prime beef shank infused with 32 secret spices, served with generous sizzling bone marrow butter and crispy ginger.",
    price: 2250,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATWGk_pIAn4sfJrrpBBCR03oEZ-zVVa8h1lEk3PCR2n7eW6AEBXerErmg3317aqSYgiutWL9pEJ-hbakK3NWo4msTFUzcJMbVs19yyj_G8yABxAG6YvOVvzO21s5YXY_Qxe5qVIFo5RcYSTI9EhZrvUEIuti6vzSTYqpZNq2-M2mEYRKoKQkzZl9E__yeO4aM5zvGHKWHtIP1DCcUXwTl0BjiMlBYdqKDgvx5-grTka8yTFakj3rWb",
    originBadge: "Royal Mughal Court",
    portionInfo: "Double Shank + Marrow",
    spiceLevel: 4,
    rating: 4.9,
    reviewCount: 512,
    dietaryTags: ["Halal", "Heirloom Gravy"],
    isFeatured: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
  },
  {
    id: "item-5",
    name: "Shinwari Mutton Dumba Karahi",
    slug: "shinwari-mutton-dumba-karahi",
    categoryId: "cat-2",
    categoryName: "Shinwari & Karahi",
    description:
      "Grass-fed Khyber Dumba mutton cooked exclusively in its own fat with organic sea salt, crushed tomatoes, and charred green chilies.",
    price: 3200,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA74W8uGN4fBmq3ose7eKrUfq2_4TSTmCSfHtJJld8B_8ZNM6Tq8n5z5jY030bTkrQiPLSgaomskbpfTpsoMBRQpd_jvQaL9jLC0k74Ei5fBCRCmfJVr8JZbOlKULKYMLxi1nvSnfzA7B28XA3BpGtqpnvqzLZgG98XkExEWLYX0zVeDAnWRq54xRPwdCIdHr4jdtp1mPjsODiR2GNASRcGK5t_bDHvIMFa7d9awPj8SvXrBiLbYQ8-",
    originBadge: "Landi Kotal",
    portionInfo: "1 KG Dumba",
    spiceLevel: 2,
    rating: 4.9,
    reviewCount: 195,
    dietaryTags: ["Halal", "Pure Dumba Fat"],
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 40,
  },
  {
    id: "item-6",
    name: "Shahi Roghani Naan",
    slug: "shahi-roghani-naan",
    categoryId: "cat-5",
    categoryName: "Tandoor & Roghani Naan",
    description:
      "Clay tandoor leavened bread brushed generously with pure Desi Ghee, sprinkled with white sesame seeds and kalonji.",
    price: 220,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDWL3gI4gjnzB3_UJ6ZvQkeshcqYOMJ6RbqFA59qvlhMKDHeWEFHp15xRDNutNMJWPsMZGh4IMNV1a5AjWvDpCcyEkF9Qs3_72uImCssWgSdmRBG-SfvDEno85aXHqUPMlqRhc-pA5-vAo9kOarnG6l7zCUk05LOJnzDFO1CvanGM90xpMEvRJ5NbDCe5fLo1pNgdzFlC4MsgvDcFWQtyOtMpoQKZUbKgfnsXR7S4xGrYJW0kGOblhU",
    originBadge: "Clay Hearth",
    portionInfo: "1 Large Naan",
    spiceLevel: 1,
    rating: 4.8,
    reviewCount: 310,
    dietaryTags: ["Vegetarian", "Desi Ghee"],
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
  },
  {
    id: "item-7",
    name: "Khas Zafrani Matka Kheer",
    slug: "khas-zafrani-matka-kheer",
    categoryId: "cat-6",
    categoryName: "Mithai & Desserts",
    description:
      "Slow-reduced rich buffalo milk with crushed basmati rice, Iranian saffron, green cardamom, roasted pistachios, and pure silver foil in terracotta bowls.",
    price: 650,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBTs8Xz-dBwNIVFsgMkiwt03LKraj9UsB1RQYkjLcei36eAiIsKiN5h_Prv6KqMgEoY43RRF-ZIS4tFrRTI3Uz3RLRNL90m21QusSm2LXydi0dt_IRsR7LwMXeforrmXBaoOWcyyEb1meukgqEUBMY2r_7dGe5Zkl7q1rGZjwbGf534JZJtyrYxHSD5JH-WFsY8701XoLbV1mO1Z6gX5qp0v0zhxvf796_v27NSOLTuZmSUlL6lU9_",
    originBadge: "Mughal Haveli",
    portionInfo: "Serves 1–2",
    spiceLevel: 1,
    rating: 4.9,
    reviewCount: 280,
    dietaryTags: ["Vegetarian", "Royal Dessert"],
    isFeatured: false,
    isAvailable: true,
    preparationTimeMinutes: 5,
  },
];

