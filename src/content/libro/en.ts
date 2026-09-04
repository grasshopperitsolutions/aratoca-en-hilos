/**
 * "Trenzando Saberes" — English.
 *
 * A faithful translation of `es.ts` — which is itself a merge of the client's
 * two manuscripts — kept in the same formal institutional register as the
 * Spanish original. AWAITING CLIENT SIGN-OFF: this is an
 * official Alcaldía publication, and the municipality — not us — is the final
 * authority on how it words its own heritage in another language.
 *
 * Conventions:
 * - Craft, botanical and place vocabulary stays in Spanish and is glossed on
 *   first use (fique, cabuya, penca, cogollo, escarmenado, varillado,
 *   alpargatas, vereda). These are the terms the literature and the market use;
 *   inventing English equivalents would be both inaccurate and worse for search.
 * - The title "Trenzando Saberes" is not translated. It is the work's name.
 * - Colombian institution names keep their Spanish form with an English gloss
 *   in parentheses on first mention.
 */

import type { LibroTexto } from '../../types/libro';

export const LIBRO_EN: LibroTexto = {
  titulo: 'Trenzando Saberes',
  subtitulo: 'History, Transformation and Future of Fique in Santander',
  editor: 'Municipal Government of Aratoca, Santander',
  version: 'A Learning and Digital Integration Guide · Version 2.0 · 2026',
  sinopsis:
    'This work seeks to revive and safeguard the ancestral and traditional knowledge bound up with the cultivation and transformation of fique — understood not merely as a craft, but as the core of the grassroots economy and the cultural identity of the artisan communities of Santander, with particular emphasis on the municipality of Aratoca. It first traces a historical path from the original practices of the Guane people to the present socio-economic picture, opening an intercultural dialogue that gives due value to the indigenous and campesino inheritance. It then sets out the technical and biological cycle of the plant, making visible the environmental and productive challenges of the trade. Finally, the work moves beyond the traditional format to become a pedagogical and interactive instrument that encourages this knowledge to be genuinely taken up. Through it, intergenerational encounter, enterprise and technical innovation are promoted, offering young people, artisans and the wider community new ways to inhabit, understand and strengthen their territory.',

  prologo: {
    titulo: 'Foreword from the Municipal Government of Aratoca',
    parrafos: [
      'It is a pleasure for the Municipal Government of Aratoca to present this second, expanded and enriched edition of "Trenzando Saberes". This work is a cornerstone of our plan to safeguard the identity of our rural communities and to revive the grassroots fique economy, coordinated through the 2026 Productive Projects Call.',
      'Fique has been, is, and will remain the soul of our Aratoca hillsides. Our municipality, known with pride as the "City of the Hills", has carried this tradition onto the world stage — most notably in Europe, through the Pontcharra Cooperation Agreement between Colombia and France — demonstrating that the art of fique transcends territorial borders.',
      'This digital and interactive guide seeks to inspire both local young people in our workshop schools and visitors from abroad who wish to understand the marvel of this biodegradable natural fibre. We invite the whole community to weave this sustainable future together.',
    ],
    callouts: [
      {
        tipo: 'sabias',
        titulo: 'Aratoca, City of the Hills',
        texto:
          'Our municipality is known as the “City of the Hills”. The Parque Principal, at Calle 4 N.º 4-38, is the heart of the town, where local artisans gather to share their woven fique work with the support of the cultural policies of the municipality, ensuring this heritage keeps flourishing into the future.',
      },
    ],
  },

  partes: {
    1: { titulo: 'Roots and Territory', subtitulo: 'The History and Wider Context of Fique' },
    2: { titulo: 'From the Earth to the Loom', subtitulo: 'The Process of Transformation' },
    3: { titulo: 'Woven Horizons', subtitulo: 'Conclusions and Digital Ecosystem' },
  },

  capitulos: {
    1: {
      titulo: 'The legacy of the Guane people and the pre-Hispanic inheritance',
      parrafos: [
        'Weaving with natural fibres has been a cornerstone of the culture and livelihood of the communities inhabiting present-day Colombia since pre-Hispanic times. In the canyon and the south-east of Santander, as well as in parts of Cundinamarca and Boyacá, the Guane people were distinguished by their deep connection to the land and their remarkable manual skill. This culture, devoted chiefly to hunting and agriculture, developed a sophisticated visual expression through ceramics and textile work. Fique, drawn from wild pencas (the plant’s fleshy leaves), was of the highest practical importance.',
        'While cotton was reserved for fine blankets and richly decorated garments used in ceremonies and barter, fique was the material of choice for everyday goods: headdresses, bags, mochilas (shoulder bags), fishing nets, lashing rope and daily footwear — designs that bear a striking resemblance to the pieces contemporary artisans still produce in the workshops of Aratoca.',
        'Because physical remains of Guane culture are scarce, owing to the damp soil, the textile pieces that have survived in dry caves are of incalculable anthropological value. They are living testimony to a technical mastery thousands of years old, one that is reborn today under the community name "Aratoca en Hilos".',
      ],
      callouts: [
        {
          tipo: 'sabias',
          titulo: 'Original masters of the penca',
          texto:
            'The Guane were the first to decode the growth cycles of the wild fique penca. With a sacred and respectful knowledge of the land, they knew exactly which lunar phases to cut the leaves in to draw out the longest, most flexible and most resistant fibres — knowledge that still informally shapes the practice of some campesino families.',
        },
      ],
    },
    2: {
      titulo: 'A socio-economic overview: the grassroots fique economy',
      parrafos: [
        'The history of Aratoca, Santander, is deeply bound to the cultivation, processing and ancestral weaving of fique fibre. This tradition, inherited from the indigenous Guane culture, was for decades the economic engine and principal source of employment for thousands of rural families in the region. In the early twentieth century the work industrialised and gained considerable momentum thanks to the boom in Colombian coffee. Mass production of fique sacks became vital for storing and transporting coffee, potatoes and other agricultural produce, both within Santander and in Boyacá, Cundinamarca and the national export market.',
        'In Aratoca, much of the rural population learned to spin and weave fique in childhood, passing the knowledge orally from one generation to the next within the family. The municipality came to be recognised as one of the great producers of such packaging in the department of Santander. From the 1980s onward, however, traditional sack production began to decline steadily as it was displaced by cheap petroleum-derived synthetic fibres (polypropylene). This triggered a socio-economic crisis across the fique-growing countryside.',
        'The shift forced the sector to reinvent itself. Faced with the challenge, local artisans and associations — supported by national bodies such as Artesanías de Colombia — promoted training to transform the craft. Fique ceased to be reserved for agricultural packaging and moved towards high-value, sustainable, contemporary products: decorative tapestries, stylish bags, table linen, traditional footwear (alpargatas) and other useful goods.',
        'Today the fique ecosystem is still sustained by remarkably resilient communities in Santander — notably the municipalities of Mogotes, San Joaquín, Curití, Aratoca and Onzaga. National figures report more than 18,000 hectares under cultivation, farmed almost entirely (95%) by families of vulnerable socio-economic background and of indigenous or campesino descent. Despite the cultural richness of the craft, the sector faces complex pressures: heavy dependence on commercial intermediaries, low levels of formal employment in family workshops, and a pressing need to diversify towards sustainable, high-value crafts.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'How the trade evolved',
          texto:
            'For new students, the key to profitability today lies in moving from the costal ralo — the rough traditional sack — towards fine, compact weaves that can be combined with other fine materials such as leather or wicker. That diversification raises the value of the finished product by as much as 400%.',
        },
      ],
    },
    3: {
      titulo: 'Furcraea: botany and life cycle',
      parrafos: [
        'Fique is an imposing, sculptural plant native to the Colombian Andes, classified scientifically within the genus Furcraea sp., of which some twenty species occur in the region. Its form is characterised by an upright stem from which spring long, fleshy leaves with lateral spines and an intense green colour, crowned at maturity by greenish-white flowers on a giant flower stalk rising from the centre. Its adaptability to the arid, steep soils of the canyon makes fique a natural guard against erosion in Santander.',
        'At biological maturity — usually reached between five and ten years, depending on soil and altitude — the plant produces a spectacular inflorescence: a great vertical stalk, the escapo, which can reach eight metres in height, crowned with greenish-white flowers that draw local pollinators. After flowering, the plant produces small bulbils that fall to the ground and give rise to new shoots, completing a life cycle both noble and generous towards the Andean ecosystem.',
        'Harvesting the fibre rigorously respects the plant’s biological cycle and integrity: growers cut only the mature outer leaves nearest the base, using traditional machetes. They leave an essential minimum of fifteen to twenty inner pencas in the cogollo — the heart of the plant — to guarantee photosynthesis, survival, continued growth and regeneration. This selective hand-cutting method allows the same fique plant to be harvested over a productive cycle of fifteen to twenty years.',
      ],
      callouts: [
        {
          tipo: 'sabias',
          titulo: 'The nobility of the Furcraea',
          texto:
            'Unlike crops that demand heavy pesticides and constant irrigation, the fique plant is extremely drought-resistant and acts as an excellent guard and binder of soils on slopes prone to erosion in Aratoca, making it a key ally against climate change.',
        },
      ],
    },
    4: {
      titulo: 'Extraction and yield: the environmental challenge of bagazo',
      parrafos: [
        'Once the leaves are gathered, the defibring process begins — and with it one of the greatest technical, economic and environmental challenges facing the artisan and rural sector. In traditional defibring, only around 4% of the total weight of the green leaf is recovered as usable fique fibre (clean cabuya). The remaining 96% becomes wet residual biomass, known colloquially as bagazo: acidic juices and crushed green pulp.',
        'Traditionally this by-product, rich in saponins and organic compounds, has been discarded without control. Because the fibre is traditionally washed on the banks of watercourses, those acidic juices are often poured straight into the streams and springs of Aratoca, altering the pH of the water and causing severe environmental damage across the micro-watershed.',
        'Recent research supported by universities and by the municipality’s productive projects indicates, however, that this residual material holds enormous potential for making ecological insecticides, fermented organic fertilisers, erosion-control biomats and handmade cellulose paper. This opens the way to a highly profitable circular bioeconomy for fique growers.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'Organic fertiliser from fique',
          texto:
            'Bagazo mixed with farmyard manure and slaked lime produces high-quality compost in just 45 days. That compost is ideal for feeding the fique soil itself, closing a wholly organic, chemical-free cycle on the farm.',
        },
      ],
    },
    5: {
      titulo: 'The craft: the seven steps to eternity',
      parrafos: [
        'In the Aratoca en Hilos workshop, collective memory and artisanal technique are kept alive through the ancestral ritual of transforming the fibre. This process, which demands physical mastery and patience, is divided into seven traditional steps.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'The secret of a good wash',
          texto:
            'If the washing is not carried on long enough, the fibre keeps natural sugars that attract insects or grow mould in humid climates. Keep strictly to the twelve to fifteen hours of soaking in clean water before drying.',
        },
      ],
    },
    6: {
      titulo: 'Innovation, sustainability and artistic co-creation',
      parrafos: [
        'Fique work is no longer confined to the traditional rough coffee sack. Aratoca has led a process of artistic refinement through co-creation with nationally recognised contemporary fashion designers and architects. With the support of the Ministry of Cultures, Arts and Knowledge through the 2026 National Cultural Cooperation Programme, family workshops have learned to combine cabuya with fine local materials such as leather, wicker, carved wood and recycled cotton textiles.',
        'This technical hybridisation has given rise to the "Aratoca en Hilos" high-design collection, which includes exclusive couture mochilas, ergonomic export-grade footwear with fique soles, rugs and decorative panels in abstract modern patterns, and lightweight furniture for interior design. Its sustainability is equally notable: a 100% biodegradable fibre that directly offsets the carbon footprint of single-use plastics.',
        'Strengthening the productive fabric of municipalities with a deep fique tradition, as Aratoca has, calls for an integrated view — one that respectfully fuses historical inheritance with the urgency of technical and environmental innovation. To secure the future of the sector it is essential to move beyond low-yield traditional technologies and to mitigate the ecological impact of primitive leaf processing, above all in the treatment of water discharges.',
        'At the same time, community organisation and association must aim firmly at dignifying artisanal work, breaking the historical dependence on commercial intermediaries and fostering the creation of local added value. Fique should no longer be regarded merely as a cheap raw material for agricultural packaging; it is a powerful vehicle of community identity, ecological design and circular economy which — combined with sound enterprise strategies and fresh contemporary aesthetics — can generate real, dignified and highly sustainable sources of income for the people of the region.',
      ],
      callouts: [
        {
          tipo: 'sabias',
          titulo: 'A link with the world',
          texto:
            'The fique art of Aratoca has crossed borders. Through the Cooperation Agreement with Pontcharra in France, Santander mochilas and tapestries have been exhibited in European art galleries, proving that tradition combined with innovation has a global market waiting for it.',
        },
      ],
    },
    7: {
      titulo: 'An interactive learning path: guide to the digital course',
      parrafos: [
        'The strengthening of the fique sector in the "City of the Hills" takes concrete form through the "Fique Crafts Workshop: Creativity, Tradition and Enterprise in Aratoca". This non-formal training programme of seven modules fosters intergenerational exchange between master artisans and young local entrepreneurs.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'The dynamics of co-creation',
          texto:
            'The key to the intergenerational module is pairing an older artisan, master of the dyeing, with a young student at ease on social media. Together they produce both a unique object and its digital catalogue in record time.',
        },
      ],
    },
  },

  datosClave: {
    titulo: 'Key figures: the national picture',
    items: [
      'Hectares of fique under cultivation in Colombia: more than 18,000, in rural areas.',
      'Share held by small family producers: 95% of the national total.',
      'Principal provinces in Santander: Guanentá and Comunera (Aratoca, Curití, Mogotes, Onzaga).',
      'Impact of the shift to synthetics: the traditional sack went into decline from 1980.',
      'Key regional support organisations: Coohilados del Fonce and Ecofibras.',
    ],
  },

  pasos: {
    titulo: 'The seven steps to eternity',
    intro:
      'This process, which demands physical mastery and patience, is divided into the following seven traditional steps.',
    items: [
      {
        numero: 1,
        titulo: 'Selective harvest',
        texto:
          'Only the mature leaves at the base of the Furcraea sp. are carefully chosen, sorted by length and thickness, ensuring the survival of the central cogollo for future harvests.',
      },
      {
        numero: 2,
        titulo: 'Defibring (extraction)',
        texto:
          'The leaves are scraped to separate fibre from pulp. This is done by hand through varillado — laborious scraping against a wooden post — or by maquinado, using motor-driven drum defibring machines.',
      },
      {
        numero: 3,
        titulo: 'Washing in clean springs',
        texto:
          'The extracted cabuya is submerged in clean water for twelve to fifteen hours to remove the acidic juices and the plant’s sticky sap, each bundle washed carefully by hand.',
      },
      {
        numero: 4,
        titulo: 'Drying in the Aratoca sun',
        texto:
          'The fibres are spread in the sun on wire lines or on breezy hillsides. Under the Santander sun the strands take on the pale beige or natural cream tone most prized in the craft market.',
      },
      {
        numero: 5,
        titulo: 'Escarmenado and combing',
        texto:
          'A vigorous brushing of the dried bundles through a rough comb of metal nails. This untangles, removes coarseness, separates the fibres and softens the fique, preparing it for the spindle.',
      },
      {
        numero: 6,
        titulo: 'Traditional spinning',
        texto:
          'Artisans twist the fine fibres using hand or pedal wheels, regulating thickness and tension to create consistent skeins of fique thread, soft to the touch. These are dyed with local pigments and leaves.',
      },
      {
        numero: 7,
        titulo: 'Weaving on the horizontal loom',
        texto:
          'On rustic wooden looms or with crochet hooks, the coloured threads are crossed with great precision. This gives rise to fine cabuya cloth, artistic tapestries, traditional footwear (fique alpargatas, or espadrilles) and decorative mochilas.',
      },
    ],
  },

  sesion: {
    titulo: 'The standard three-hour session',
    intro:
      'In-person sessions follow a rigorous practical methodology in a three-hour format.',
    items: [
      {
        titulo: 'Welcome and warm-up',
        duracion: '10–15 min',
        texto:
          'A short group activity to break the ice and prepare participants physically for the work ahead.',
      },
      {
        titulo: 'Technical demonstration',
        duracion: '20–30 min',
        texto:
          'The master artisan gives a direct practical demonstration of the day’s fique step — spinning or dyeing, for example.',
      },
      {
        titulo: 'Guided practical work',
        duracion: '90 min',
        texto:
          'Students practise directly in pairs, with individual mentoring from the senior artisans.',
      },
      {
        titulo: 'Shared review and feedback',
        duracion: '20–25 min',
        texto:
          'Participants present their progress collectively, identifying common faults in the knot and the technical solutions to them.',
      },
      {
        titulo: 'Tasks and micro-challenges',
        duracion: '10 min',
        texto:
          'A small practical exercise is set, to be completed at home or in the family workshop before the next session.',
      },
      {
        titulo: 'Record-keeping and close',
        duracion: '5 min',
        texto:
          'Technical photographs of prototype progress, group notes and attendance for the Municipal Government of Aratoca.',
      },
    ],
  },

  modulos: {
    titulo: 'The curriculum: seven modules',
    intro:
      'At the heart of this non-formal programme is the “Fique Crafts Workshop: Creativity, Tradition and Enterprise in Aratoca”. The workshop follows a curriculum of seven thematic modules.',
    items: [
      {
        titulo: 'Introduction to the heritage of fique',
        texto:
          'The history of the fibre in Santander and Aratoca, its deep cultural meaning and its environmental value.',
      },
      {
        titulo: 'Traditional transformation techniques',
        texto:
          'Guided practice in defibring, hand spinning, basic weaving and natural dyeing with local pigments.',
      },
      {
        titulo: 'Applied design and creativity',
        texto:
          'Building moodboards, exploring patterns, and designing contemporary products for everyday use and decoration.',
      },
      {
        titulo: 'Marketing, branding and sales',
        texto:
          'Building the brand of the family workshop, product photography on a mobile phone, running WhatsApp Business, and calculating fair prices.',
      },
      {
        titulo: 'New techniques and innovation',
        texto:
          'Direct collaboration with guest designers and experimental blending of fique with fine materials: wicker, leather and recycled textiles.',
      },
      {
        titulo: 'Intergenerational dialogue and community building',
        texto:
          'Sessions where elder weavers share traditional accounts and younger participants contribute their technological skills.',
      },
      {
        titulo: 'Final production and closing fair',
        texto:
          'Creating a line of exclusive objects and preparing them for sale and exhibition at the local fair run by the Municipal Government.',
      },
    ],
  },

  modulosWeb: {
    titulo: 'Modules on the digital platform',
    intro:
      'As an interactive extension of this digital work, the "Aratoca en Hilos" web platform takes on the following three learning modules, designed to ensure that this knowledge is genuinely taken up by the community.',
    items: [
      {
        titulo: 'Innovation and Design (creative pedagogy)',
        texto:
          'An interactive classroom that encourages weavers to move beyond the traditional fique sack towards contemporary fashion accessories and interior décor, working alongside guest designers.',
      },
      {
        titulo: 'Sustainability and Bioeconomy (care for the land)',
        texto:
          'Practical video tutorials on fermenting the 96% of residual fique bagazo into organic fertiliser, avoiding the discharge of fique acids into Aratoca’s water sources.',
      },
      {
        titulo: 'Enterprise and WhatsApp Business',
        texto:
          'Digital training from Aratoca en Hilos on mobile-phone photography for catalogues, fair pricing and direct community sales, reducing reliance on commercial intermediaries.',
      },
    ],
  },

  assets: {
    TAG_01_HERO_PANORAMA: {
      titulo: 'Panorama of the Chicamocha Canyon and the fique fields of Aratoca',
      alt: 'Aerial view of the Chicamocha Canyon with the terracotta hills of Aratoca and agricultural terraces of fique under bright sun.',
      pie: 'The Chicamocha Canyon and the fique terraces that give Aratoca its name: the City of the Hills.',
    },
    TAG_02_GUANE_MUSEUM: {
      titulo: 'Guane textile remains: fique yarns thousands of years old',
      alt: 'Fragments of preserved Guane textiles: braided fique nets, primitive knots and geometric patterns dyed with mineral ochres.',
      pie: 'Guane fragments held in anthropological collections — knots and weaves almost identical to those made in Aratoca today.',
    },
    TAG_03_PORTRAIT_ELDER: {
      titulo: 'Portrait of Doña María, master spinner of Aratoca',
      alt: 'An elderly artisan from Aratoca smiling as she holds a traditional spindle with freshly spun fique thread, her hands and the golden yarn in sharp focus.',
      pie: 'Doña María, master spinner. She learned the craft at six years old in her vereda, the rural hamlet where she still lives.',
    },
    TAG_04_LANDSCAPE_FIQUE: {
      titulo: 'The anatomy of fique: penca and cogollo of Furcraea',
      alt: 'A mature Furcraea plant with emerald leaves and reddish lateral spines, the central cogollo intact and clean cuts on the basal leaves.',
      pie: 'A mature Furcraea: the central cogollo left intact, and the clean cuts that let the same plant be harvested for fifteen to twenty years.',
    },
    TAG_05_TRADITIONAL_DESFIBRADO: {
      titulo: 'Mechanical defibring and the flow of residual bagazo',
      alt: 'A worker feeding fique leaves into a drum defibring machine; pulp shoots out through a chute while the long fibre emerges clean and taut.',
      pie: 'For every hundred kilos of green leaf, four become clean cabuya. The other ninety-six are bagazo.',
    },
    TAG_06_FIBERS_DRYING: {
      titulo: 'Fique drying lines in the Aratoca sun',
      alt: 'Thousands of natural beige fique skeins spread across wire lines crossing diagonally, against a deep blue sky.',
      pie: 'The Santander sun gives the fibre the cream tone the craft market values most.',
    },
    TAG_07_SPINNING_WHEEL: {
      titulo: 'The spinning wheel: hands in motion',
      alt: 'Close detail of a traditional wooden spinning wheel in rapid motion, the artisan’s hands controlling the tension of the fibre onto the spindle.',
      pie: 'The pedal wheel, where combed fibre becomes thread.',
    },
    TAG_08_LOOM_WEAVING: {
      titulo: 'The weave of the horizontal loom at Aratoca en Hilos',
      alt: 'Overhead view of a traditional loom’s wooden reed crossing fique skeins dyed in terracotta, olive green and brown.',
      pie: 'The horizontal loom, pre-Columbian in origin, is still the craft’s final tool.',
    },
    TAG_09_BAGAZO_INNOVATION: {
      titulo: 'Bio-fertilisers and products of the fique bioeconomy',
      alt: 'Biodegradable pots made from pressed fique pulp, textured handmade paper packaging and bottles of ecological insecticide labelled in Aratoca.',
      pie: 'The bagazo that once polluted the streams, turned into plant pots, fertiliser and natural repellent.',
    },
    TAG_10_MODERN_PRODUCTS_FLATLAY: {
      titulo: 'The Aratoca en Hilos high-design collection',
      alt: 'Overhead still life on pale wood: fique mochilas dyed with tree bark, circular table mats, alpargatas with leather detailing and a geometric woven cushion.',
      pie: 'The contemporary collection: the same fibre, four hundred years after the sack.',
    },
    TAG_11_TALLER_SESSION: {
      titulo: 'A meeting of generations: the fique workshop in Aratoca',
      alt: 'An elderly artisan patiently guiding the fingers of a young apprentice tensioning fique warp threads on a small frame loom.',
      pie: 'The intergenerational module: the master brings the technique, the apprentice brings the digital reach.',
    },
    TAG_12_APP_UX_MOCKUP: {
      titulo: 'The interactive book application',
      alt: 'A tablet on a rustic wooden table beside coloured fique threads, showing the book interface with an infographic, an audio player and a map.',
      pie: 'The interactive book, designed to read the same in a school in Aratoca as on the other side of the world.',
    },
    TAG_13_ALCALDIA_DELIVERY: {
      titulo: 'Official presentation of the book in the Parque Principal of Aratoca',
      alt: 'The mayor and representatives of the fique committee alongside artisans at the official presentation of the book in the main square.',
      pie: 'The official presentation in the Parque Principal, Calle 4 N.º 4-38.',
    },
  },
};
