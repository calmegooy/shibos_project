import { MenuItem } from '../types';

export const MASCOT_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9t9CCC9SJxD0Mm5iS6FGTHh901Kv7_V3ObN57Nrd-bd-GG7N0An76ImlI4-eDRdjEqlhdtCMcyV03225zfgRojbTVYYqLyZbThJnvNVqrP1_XY8l0XnN_6smaT5vyQy6X_owsIiw7eeRq8r8HX2NJMyrYqc8YyGTCwTUMYnFyg-0bnw6VyZvhdmiv9avdRopw50OaMd2WgqJaTyfAFEl031aXXb6UAa6AmG2qIGndac2VD1K_cXKY0g';

export const MENU_ITEMS: MenuItem[] = [
  // --- Minuman Susu Segar ---
  {
    id: 'susu-original',
    name: 'Susu Segar Original',
    category: 'minuman',
    price: 10000,
    description: 'Segarnya susu murni kualitas peternakan terbaik lereng Merapi.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDBgq-5HBNrgLoWQLg4duGUA4HefRaNRColEZFPNQaeyA3_iAMF_2P_XWkr7Qa1DvEX9WxAuxuegES2xzBZLwu6PCjpcFs0I0jEBNg6X1s5ArlgJn7zOAP5jvav3B3fYr4WvNB2DyzBGd9IAQuvmv7ZVOX3PvNs53JBMOtltnJDU3rqxL9dMje2PnQUGzKytr5dxcg3CsQu7qnhIgXLja0O-FLAx_cu4ytyDZk2Yt_RYYEwgVyTTINnZw',
    badge: 'Bestseller',
    isBestseller: true,
    isPopular: true,
  },
  {
    id: 'susu-cokelat',
    name: 'Susu Cokelat Belgia',
    category: 'minuman',
    price: 12000,
    description: 'Cokelat premium lezat berpadu susu murni creamy.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWV_cwFYRMP5Af8m5_iSJANhmT8OPQso5inKdPA7hYzf9gFwckIeeACKRC3vxZCa0lMURk4R5rF2QYH_zTqW4opqwBzdhDRDqe4W1wquJ8c2vao7B2YH4DaRoBvDs9HpC-hrrDZlKCwRACSDZigUqnnWQZQPiNbYDDUxmZOpfaOnjSYd62geDHzzd5Bk_cKTglXwowI_fxQEHqn3sYAKZp3ITl48rTIV66Gf5n4aAAMWmcwGIBRUD6_A',
    badge: 'Favorit Anak Muda',
    isPopular: true,
  },
  {
    id: 'susu-strawberry',
    name: 'Susu Strawberry Korea',
    category: 'minuman',
    price: 12000,
    description: 'Sirup strawberry asli manis segar berpadu lembutnya susu.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCMGS6Zk2HG3k7BxduCLjE2DZaw8M7Y5ZMDGf1mnXe1gUB-DKyIAp4R_vAJIc_eUOa8gpGLyNFJ-nbTZ6IiqkneA3Q_LH4pIjQZ24_Yqt86sOL8mmQH-BMV2c562i82ZeEUgiYhNoRhdwkYNba01fLHPbmTv8SEhJzNIRdfXPFJKgeecsAgB6YxAgYER8zHEAHFwe-CydgMEWvwqZMNhvSMEVv44WphdV3w4vbrgwaObjtERKtn4kk5ow',
    badge: 'Segar Alami',
    isPopular: true,
  },
  {
    id: 'susu-matcha',
    name: 'Susu Matcha Kyoto',
    category: 'minuman',
    price: 14000,
    description: 'Green tea matcha Jepang otentik & susu murni segar.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVEnG_fyJEx4zAWGIWJiaf4VJNWBFRaXcteZzthpjuHGCMkJNX50x5o4ykWle0xY-TcqDG_7Pu1hNe3uCFYMIIG5OCsVahE1OCrTFRlyoF-ZsVF8toKiLK157Kv7M7NX31AoLl182zDRvxSAFaTfp6ZXB0aNTV377SsqWBP7n1WACVmE16mfN0q_CkqEoLkhDgUqs32c0_U3tYxjUCElnm0hgrIWvJxMBeXtgz3x42eD6F1NWn7HsW3g',
  },
  {
    id: 'susu-taro',
    name: 'Susu Taro Ungu',
    category: 'minuman',
    price: 13000,
    description: 'Rasa taro manis lembut dengan aroma harum khas.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCs5nsAem6JRvB1KiDfpqUBKLXz7fStPWA7lCtLJaxT7pjmmaxyw5PpboixBmEn3ErvA1SxcVBgk5ZAT77J_Zvgg6dajvsAP7GYsBZhOBIaXBl8Q7vzUpK1US-PbSNRDeSM7VDiSI2PaWNwdzp9cnCzXZYHAQXKhCBSWlrXje2b69LhuP3zBnoHo9a-stdP1wpy4KlliH51gCM0hzUJnC_At1nNvc5dS-JYk2Qr5kASoUPtoKwrflgog',
  },
  {
    id: 'susu-oreo',
    name: 'Susu Oreo Cookies',
    category: 'minuman',
    price: 14000,
    description: 'Susu creamy dengan taburan biskuit Oreo renyah melimpah.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCeHdtPjxCyV6KKBXZvYJMUNFTHWMDdAPgJ23XrxMoRQxsw4fiw3nzHreVS3ApO13mjugiyjCjp1F_rYbgRRpwmwdbDzjv4NUgsIOYsZleuli5WNmkRmic6u5Xrn6Im3Xym3P2XKaZNQPbu94nZbLe8-OKk1eU8n4fNP5FZGA6QHs9c_gdFvFw4myjP2hF5jeYjBNR51e1hBnll8K-OhjlIrsdi13HBXh3ENR6lhg7MoXepafvd9PdHuw',
  },
  {
    id: 'susu-caramel',
    name: 'Susu Caramel Butter',
    category: 'minuman',
    price: 13000,
    description: 'Sirup karamel bakar manis legit gurih berpadu susu dingin.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGndnN9InGdjHVFTVMvTSyU7o3_76U74ARs52Zaw8dbAKc87Nz-D0m7wHxniHAe0YXvEOGNvTDdHHiGvC7k0Ro5n3b3Vb_MBcBl1atcTzCpzjYeqVb_4p-lhL8P0kWfT-2rVWJeRYMeIYLiCa4BK-WWDAW0bvp5P3uhqlSPWnPuqf4vaffSqcdEstq9_SenJ7DmlFxLLZstwV6Aeh7KkZBg1fhDf7dMeigpMRPEv_qs_RHSAP9ZSHvog',
  },
  {
    id: 'es-teh',
    name: 'Es Teh Manis Segar',
    category: 'minuman',
    price: 5000,
    description: 'Teh melati seduh segar dingin pelepas dahaga.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBqTfUxxFr0MFsCywhM1QIjEcseDqisg7A7QPvHTHk8dPl5yjsWFvyrYQW-WNRLFxyfOjIMdtfmhtWyvgduSGO3VBPkqL97y_i8yvhFpAahMSQr8n_ANX0rpV2VJS7GTr4FhkGyfgecPWFQMBlmp26QMQn9vS-PEGOphL8ihJJyhrU5iQyoTWqSfXZO4eL22BeA5sCQWCVgpLzaT6MIYza81CpZypK1Hi7RPodbfSgcYs2KYi5SQgLdaQ',
  },
  {
    id: 'susu-cokelat-rich',
    name: 'Cokelat Dingin Extra Rich',
    category: 'minuman',
    price: 12000,
    description: 'Dark cocoa pekat kental menyegarkan dengan sentuhan gurih.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5rAUEjpgqvLeN5YirDc1pBH6-00yL5P_iAbR1KnWUqSjSlFbAk2gnbIq5e1ECzDCZgVRqQvCSeGM68zZ6tQpp7hK4anHPh_ZIuwXfVgoGRQn2jOZ2ya0Hl-_Gh1SpT6RkGF85MVWknTS9l0T-CPlHCcVjIdI7kU01MkfmHqaGPvAM4OzF7rVZ6nWZQ3BuYJzNooYRQ3v8LKY966CIafaBJMcyd6vwVs-2-jVdreBLIrx2HA0h8ctdFg',
  },
  {
    id: 'susu-jahe',
    name: 'Susu Murni Jahe Hangat',
    category: 'minuman',
    price: 12000,
    description: 'Susu segar hangat racikan jahe bakar tradisional penyegar badan.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAIPNvSAnWcmCeDfa0zk7LYCCHilvQkqvOyq2VOOA9Jls05ZreoIlHVJL63ECHObYVWdndefvbpuFergG5ZyIrobR5CLpUs1VAkaR--wvvR4L_V4domdvFmrQ95A_Wlu4zWwClnzXRKm_Y_WtjBD1_9RYtxl34zqKR_tbQEvLxak-9UMND0Je232iEiEAu8m0jWt8j0s-xVBDbsjPZVFSrCfkCqv_YKDAtKroPD07MfR8tOmqNwqPjTWA',
  },

  // --- Snack & Camilan ---
  {
    id: 'kentang-goreng',
    name: 'Kentang Goreng Renyah',
    category: 'snack',
    price: 12000,
    description: 'Kentang goreng renyah bumbu gurih spesial saus cocolan sambal.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCt1w78ADuHD9q93aSnnfRThpSdL4QlaVZk5d1-HZmP-lvQQ1DelP_shcpXYajl74Xn-2G_nvdCUejKiks72YKQ51YP17rWM29mrJTay4lqMgpzKhjHMEbObSdRMAPDTlOvclm3bAlHD4uMCtHk5K3ZvCg853kRtD8SYb6lsj2wHcb6hsGcTCtVIhdZ5UFeAh-QZ5SDGCArXT1i8mnkgqGTY-nRHXnpj2Wk7EGZntAUvUUbeBGs5t-CiQ',
    badge: 'Camilan Populer',
    isPopular: true,
  },
  {
    id: 'sosis-bakar',
    name: 'Sosis Bakar Jumbo',
    category: 'snack',
    price: 12000,
    description: 'Sosis sapi bakar bumbu BBQ manis pedas gurih mantap.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAYV7keHpRK_duQ6XwLGgWTue77V_M-shvW1grB7yepm_TatBeIfdPsIYSPSVEEobn6RG0brHgzblj7kxejxMjI210pHQLnLiH7E01rr5pqt2tzHWMkqJpIqKjtUT7zHEiLbQsMFLUYN9eqxfpwfbZfaQOkuGIF203CCTQH0dNjuuqpm0DIQZRwgjHlIExXMYE9qNJntD6CA5eBRH4W98NN-zRjQSlSbIt7E_dFqDjcAXIZX-FLJZ74w',
  },
  {
    id: 'nugget-ayam',
    name: 'Nugget Ayam Crispy',
    category: 'snack',
    price: 12000,
    description: 'Nugget ayam gurih isi 5 pcs dengan cocolan saus mayones spesial.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDT-_cv8X9aa0IRmOr0-_jwv2y0lWjBQydPE1D0jIDVDK4Rj_TgT7_RWYrcDlIytgexTsfFuWAlgLu5lAo1XG5KATFJV4wWWZI9GWgeIeVJTMlRzQIz8wOkIar5p12axGPraRYoNM5mPJvGpuWM9mhRBpW2D0m8CdcV_ZkGvhbvBa_ZMF-fwb4QbREikEC9dXwS3doKd1kc05FNRfvk6zLx88qwqAwJiNH6SuBwgVmtnaNzKl_zjECtGQ',
  },
  {
    id: 'roti-bakar-cokelat',
    name: 'Roti Bakar Cokelat Lumer',
    category: 'snack',
    price: 13000,
    description: 'Roti panggang mentega isi cokelat leleh manis nikmat.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ7F3qe3xw-qguWvuJwjPM1q3CQ8OcGwr4B2a_LJqYa6pGy1tOx-VrIVH8xo7OkB2bUaNbtrk_IlM4ZrlsobI_E8bspLNGehPQ5sJUCs9J6x3ISawOZ6CgJpDeNQNcgUgOsOP0-wtWgSm7R2J2biehVO3XNpYEy99MlT4e005l1OF_ga7Rj4EHfIxMN4l666axDHGCM_UO-hsLf4SFudoPOpV2-I23ysDx-YGtuD8QLNH0d_Ron1UBNw',
  },
  {
    id: 'roti-bakar-keju',
    name: 'Roti Bakar Cokelat Keju',
    category: 'snack',
    price: 14000,
    description: 'Topping lumer melimpah roti empuk bertabur keju cheddar gurih.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA6zlkY71LJ80sDtEtWbtq-i-TxwkMUpD9vnkT8zCZEJwzB7iwnCIliggQnJ5q93S1uNtpKrEr-L_5A9COD4K0lpkxRPGqoERCSl8GCF1HXOWgMfyYRx0WGgpWgZt2ZUktFTYNBbXNkCw-1OR__OU-o7lw1j_HzBnUKQYAsjAs-Wc-0sWz5EEerSB7Cb1C4g9ApQPtE3OgtmlIIg9repSkUx9U2jlOwfou_mwa4DHw3fUSHW0zVupbUFg',
    badge: 'Paling Laris',
    isPopular: true,
  },
  {
    id: 'pisang-goreng',
    name: 'Pisang Goreng Cokelat',
    category: 'snack',
    price: 12000,
    description: 'Pisang raja manis balut tepung krispi saus cokelat tebal.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBsjHoIWyBJeOFZ4eZL-dVdPGCoFFElWhFYfL_-R5ephkjiwFFI5X5SE-nM1srzyeE8FxrsDMUwSaGCEo0WOxYD_4Ehqw7CBP-WgRh3k2n-E89FOoMkBwUfV7ff-fwnwJtiVduBNKYERtX3Faiy_XqIXQL34gQLkrMkKhoP7-CvUnJ1FhHzh9GL3dkyQtMk1D1T_KJFM7uSXxYnnm325pRBmoqyK3xkuCMZdH2GYJc6Kh7Jr2ZGxFUUpg',
  },
  {
    id: 'cireng-rujak',
    name: 'Cireng Renyah Sambal Rujak',
    category: 'snack',
    price: 10000,
    description: 'Cireng kenyal renyah khas Nusantara disajikan saus rujak pedas manis.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXT_W5cX_S-uBqe78V-RKDOdzE6vKHCzCsMm2q4v5FRJwVA3e423wkReqPRmFIHviBpm-zTpOg289KxRUjkJ4r3w8ds1K2FBjQGFXiQaerao1BH_1KfFEEtggD4YKIJ4H4hN3FsllxsODX9ETlcg53DWqx5cYyORUUcndVFcrtuZem1GqZufhS7s7MCU6qSoCC__ufoyt3DI51n_QuL2k29sc6zVKNrPuWyVJe1jRGyK7U7zM4jQygVA',
  },
  {
    id: 'onion-rings',
    name: 'Crispy Onion Rings',
    category: 'snack',
    price: 12000,
    description: 'Bawang bombay lapis tepung krispi gurih dengan cocolan saus tomat.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDTZh1L0uLmEf43PdjncAdszwi2B5hvS9ezAUbzsdKwv0Pr_8e-Ye70q8UB7HjxglWNlQGXdipZf5orGl6iU3QXtouxJPbXZGGpqHEGV8PIEUemwoZg5B_7EGeuEGQeS-HPrAnn6N_qdKsma0dIO9z_az8zj7bP1lNqOAzlyCYbMY44mkAVfZ062KL6gLL7q7Yg01nPmcWJg5dVtqZ-DKvZlhBEV-28ujZFgH9pZKeWNlt0JQgSsSo2WQ',
  },
  {
    id: 'tahu-crispy',
    name: 'Tahu Crispy Shi Boss',
    category: 'snack',
    price: 10000,
    description: 'Tahu pong goreng garing berbumbu BBQ tabur cabai gurih harum.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBCnk8zBtNoGrgtDl__Ai_Rl1RxuZCY-fC-8YSBg-5SJLm_PKozMWRIA7Ya7kcaWq2hc9J0CY1G8gzwjLkUqRxJM0SqX0mGsM7Ag-bUgPn6RHmQmlOTZf_D_Ytp-zyowtr8cdIo_LP3Q8Bn9AIrc68uo9r7PgOwgMIz1pMaW8vReZvG7-D8APSimybQwa4g4QdbPwTjHP-yRZRd6Ne_n7ZXy48xDYWZBPKC1qVLdhS5yYXK_FHVMlg-UQ',
  },

  // --- Makanan Berat ---
  {
    id: 'nasi-ayam-crispy',
    name: 'Nasi Ayam Crispy Sambal Bawang',
    category: 'makanan',
    price: 20000,
    description: 'Ayam fillet goreng tepung renyah + nasi pulen hangat + sambal bawang gurih pedas.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVJLnCtrGSt_ahKHVEi_pbNRzxxdQ5W0SArpu4Sg9rZmkoYZva_oHKNG8I107VpRniBb3FzJyI-J0g_Kr8CYEylJYCEW2e-AndD1rJdDBwGkTAt7Cv8wqUbU6A9IkWv5LmcU73X14TMd26NahwNYBLWl4iLegGIBxEoElytEEFR5fXgwUs4RpLdpn0mNHAWXg15WNDAbJUZUeWPVguLvCKNzvDL25gqvObLX5kERg4eLDLchcsCKzuqA',
    badge: 'Kenyang Mantap',
    isPopular: true,
  },
  {
    id: 'nasi-ayam-korek',
    name: 'Nasi Ayam Sambal Korek',
    category: 'makanan',
    price: 20000,
    description: 'Pedas nendang lalapan segar timun tomat ayam krispi renyah.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOlO0OvDxDliQXyyidYQzf_ROarw_VS6PWysBIh8ybjWYNWH2fQb0LkxuKIroGFUBeKUZcYMwdoIS5D8zh2CTFScxIyjoUGndwdxQ8ZQxZNNUQdcszhtxzCfoPyJbJP3JobBcaRMoG796VHdWXlkeYh9zXzXZU8I8RplZZL0YcgasDwxjUCVlYC-NbjvW-rdCkNuKg_2Z1B1xCowaHodeQo9p8alVgi8Ae62Lwbl4-px2vUUUBHGTeeg',
  },
  {
    id: 'chicken-katsu',
    name: 'Chicken Katsu Rice Bowl',
    category: 'makanan',
    price: 22000,
    description: 'Fillet ayam katsu renyah saus tonkatsu gurih di atas nasi jepang hangat.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0QXHHjAbLhqwAJ0kfzv9bubDN2zJzUvdE_3vzumplfuiwKgvQdFzYTyS4DQy_EDfozpvXPTu3q7BczeirLJSDIAPQclmSfagUPC9Sj9pmlL_yhR5SvvcTgCadmkE-1jxhd_9yucbSZpMSFq7egEu6-uDsm3UXL-UvjljTJdDuqapucsy3mewGzW2e4UHThqIYB615tAwZ0cDP_3xiWOF9yuEickdfI9N3Kl7t1iQX45PaASJJ2PZAbg',
  },
  {
    id: 'nasi-goreng',
    name: 'Nasi Goreng Spesial Shi Boss',
    category: 'makanan',
    price: 18000,
    description: 'Nasi goreng bumbu spesial telur mata sapi, kerupuk & acar segar.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZGAcXyW4-akR3KGC_w-eXgwK3Ge3qWHXb2JYPaPxRhnBNgsggs5JmKTz_YS2WmT4rE-2WcW28X305cb9r_fhoFISCF1OJ12WKeHO-eARvjFb_7DVe1Xf_arL6QD5CIjjgliufgQOKhLD3fkyTtAriZhR5IOj_4BBgYce7xV7bj2i32eGuQWlr-np6f69l93oEpsd_yowcotMf81zSsVlBEi2rAOeEQVuCDsubEv1pR4J7rbAFKCiROg',
  },
  {
    id: 'mie-goreng',
    name: 'Mie Goreng Telur',
    category: 'makanan',
    price: 16000,
    description: 'Mie kenyal gurih bumbu rempah telur orak-arik & sayuran segar.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKUMquMI0_4Rgr9DMpMm-9ZNlilPfahm5bgh-uiwT9zk3CTelPbXxIFA-Z6ybpZsXC-AhSqZ-InFJZn0zgj_LfT5jqblDirr8whPGTgpugLuE1CQfUYefm65DYoagx0q0SViJZHqc1LX9iJZ6JUb6GehfM5MPJ_0BxQ5xwVWfDvsmwQAn1_FTqOexVK_UE0a7b2Bp7J-54U8RrfybabyczvNP3bU9b9EG_SXIS_odsim891uscokhUhg',
  },
  {
    id: 'rice-bowl-teriyaki',
    name: 'Rice Bowl Teriyaki Beef',
    category: 'makanan',
    price: 25000,
    description: 'Daging sapi empuk saus teriyaki manis gurih melimpah dan taburan wijen.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChCZw27WGY_rwRwJa1I_o8SV8E9HW9xbAtV2tGKw5kDHsh2Efg5XZuixSfXt-JGm37o4Qg2Sy-aku6N7yAB4m6iooHeqjyW-TPEK_BOFzJJQdD8FlNnkpzJIjL95xgzGFAZrnXx7qZx2RIOp7CnhRyIrYNnEOGVDz8tYxYBdVVo67XHnzQQb9TGAMR1tOmRtPMVT8eCDBVtHUn1rgdSAxNe8Iv9t_YulBlssJS-MPAm6LI7vQYvYoOcg',
  },
];

export const SPECIAL_PROMO_ITEM: MenuItem = {
  id: 'paket-kenyang-shi-boss',
  name: 'Paket Kenyang Shi Boss',
  category: 'makanan',
  price: 27000,
  originalPrice: 30000,
  description:
    '1 Porsi Nasi Ayam Crispy Gurih + 1 Gelas Susu Segar Original. Perpaduan sempurna pedas gurih & segarnya susu murni!',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCbwwH6Zgq1ByfRRw1G_VSuaWGe9VFk2PtRJoaxgTB3GTHa0yf-I5il5KCIJRLoE_Z-081BGSDBLRS6JfLBzv7J3gVO3Osi582oPJmUWvfKRv4jw0BtzZCswpQaYOucZ1j38nYKQfzv02JKbrOj6o_X_3JAE3fPk0xoNfVfK_ehXmmchXp9TRNzSc_AuCUlFXUMJdU0mMPtXUyaVQAG3LF4Zb3BsOE63XvyrXdaUh2krsC_8tKSfMvxMQ',
  badge: 'Hemat Rp3.000',
  isPopular: true,
};

export const INITIAL_CART_ITEMS = [
  {
    cartItemId: 'item-1',
    item: MENU_ITEMS.find((i) => i.id === 'susu-cokelat')!,
    quantity: 1,
    modifier: {
      temperature: 'Dingin' as const,
      sugar: 'Normal' as const,
      ice: 'Es Normal' as const,
      toppings: [],
    },
    notes: 'Es sedang, Gula normal',
    unitPrice: 12000,
  },
  {
    cartItemId: 'item-2',
    item: MENU_ITEMS.find((i) => i.id === 'susu-strawberry')!,
    quantity: 1,
    modifier: {
      temperature: 'Dingin' as const,
      sugar: 'Kurang Manis' as const,
      ice: 'Es Normal' as const,
      toppings: [],
    },
    notes: 'Es normal, Less sugar',
    unitPrice: 12000,
  },
  {
    cartItemId: 'item-3',
    item: MENU_ITEMS.find((i) => i.id === 'susu-original')!,
    quantity: 1,
    modifier: {
      temperature: 'Dingin' as const,
      sugar: 'Normal' as const,
      ice: 'Es Normal' as const,
      toppings: [],
    },
    notes: 'Original murni dingin',
    unitPrice: 10000,
  },
];

export function formatRupiah(amount: number): string {
  return 'Rp' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
