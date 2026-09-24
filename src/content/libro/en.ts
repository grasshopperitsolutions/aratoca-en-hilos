/**
 * "Trenzando Saberes" — English.
 *
 * A faithful translation of `es.ts`, kept in the same formal institutional
 * register as the printed original.
 *
 * AWAITING CLIENT SIGN-OFF: this is an official Alcaldía publication and the
 * printed edition exists only in Spanish, so this English edition lives solely
 * on the website. The municipality — not us — is the authority on how it words
 * its own heritage in another language.
 *
 * Conventions:
 * - Craft, botanical and place vocabulary stays in Spanish and is glossed on
 *   first use (fique, cabuya, penca, cogollo, maguey, varillado, escarmenado,
 *   alpargata, vereda, costal). These are the terms the literature and the
 *   market use; inventing English equivalents would be both inaccurate and
 *   worse for search.
 * - The title "Trenzando Saberes" is not translated. It is the work's name.
 * - Colombian institutions keep their Spanish names.
 */

import type { LibroTexto } from '../../types/libro';

export const LIBRO_EN: LibroTexto = {
  titulo: 'Trenzando Saberes',
  subtitulo: 'History, transformation and future of fique in Santander',
  editor: 'Municipal Government of Aratoca',
  lugar: 'Aratoca · Santander · Colombia',
  edicion: 'First edition · 2026',

  presentacion: {
    ordinal: 'Opening words',
    titulo: 'Foreword',
    firma: 'Mayor of Aratoca',
    bloques: [
      {
        tipo: 'parrafo',
        capitular: true,
        texto:
          'Some municipalities recognise themselves in a river, a mountain or a date. Aratoca recognises itself in a fibre. For generations fique has been far more than a crop here: it was the trade that kept the household going, the thread that drew families together under the enramada, and the language in which this territory learned to name itself before the rest of Santander.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Those of us who grew up watching our mothers and grandmothers spin in the corridor, and our fathers come down from the hill with a bundle of fibre on their shoulder, know that this knowledge is written in no manual. It is learned by watching, corrected with a hand laid over yours, and passed on in a low voice while the work goes on. It is precisely that condition — oral, practical, everyday — that puts it at risk today.',
      },
      {
        tipo: 'parrafo',
        texto:
          'This book comes from a simple conviction: what is not documented is forgotten, and what is forgotten stops producing. That is why the Municipal Government of Aratoca decided to gather into a single volume the long history of fique in our territory, the technical description of each phase of its transformation, and an honest reading of the challenges the sector faces. This is not a nostalgic tribute. It is a working tool.',
      },
      {
        tipo: 'parrafo',
        texto:
          'The pages that follow take in the inheritance of the Guane people, the rise of agricultural packaging through the twentieth century, the crisis brought by synthetic fibres, and the reinvention our artisan families are carrying out today towards higher-value products. They also address something we can no longer postpone: making use of the bagazo, and caring for our water sources.',
      },
      {
        tipo: 'parrafo',
        texto:
          'We hand this first edition to the artisans of Aratoca, to the young people seeking a dignified livelihood in this territory, to the teachers who would take it into the classroom, and to those who visit us and want to understand what lies behind a mochila, an alpargata or a cabuya rug.',
      },
      {
        tipo: 'cita',
        texto:
          'May this book circulate, be written on, be lent and be argued over. That will be the best sign that it served its purpose.',
        fuente: 'Foreword',
      },
    ],
  },

  sinopsis: {
    ordinal: 'Editorial note',
    titulo: 'About this work',
    bloques: [
      {
        tipo: 'entradilla',
        texto:
          'This work seeks to revive and safeguard the ancestral and traditional knowledge bound up with the cultivation and transformation of fique, understood not only as a craft but as the core of the grassroots economy and the cultural identity of the artisan communities of Santander.',
      },
      {
        tipo: 'parrafo',
        capitular: true,
        texto:
          'The journey is organised in three movements. The first traces the long history of fique, from the original practices of the Guane people to the contemporary socio-economic picture, in an intercultural dialogue that gives due value to the indigenous and campesino inheritance. The second sets out the technical and biological cycle of the plant, making visible the environmental and productive challenges of the trade. The third gathers the conclusions and projects the routes of innovation the sector needs to travel.',
      },
      {
        tipo: 'parrafo',
        texto:
          'The emphasis falls on the municipality of Aratoca, but the account holds for the whole fique-growing belt of the provinces of Guanentá and Comunera. What is told here happens, with local variations, in Mogotes, San Joaquín, Curití and Onzaga.',
      },
      { tipo: 'subtitulo', texto: 'How to read this book' },
      {
        tipo: 'parrafo',
        texto:
          'The text can be read straight through, but it is also meant to be consulted in parts. The technical chapters work as working sheets: they describe, step by step, what happens between the penca cut on the hillside and the finished product on the loom.',
      },
      {
        tipo: 'caja',
        rotulo: 'On the words',
        parrafos: [
          'Throughout the book the terms the artisans themselves use are kept: penca, cabuya, varillado, escarmenado, cogollo, bagazo. All of them are gathered and explained in the glossary that closes the work. Preserving the vocabulary of the trade is also a way of preserving the trade.',
        ],
      },
      { tipo: 'subtitulo', texto: 'A necessary warning' },
      {
        tipo: 'parrafo',
        texto:
          'This is not a closed inventory. Documenting living knowledge never ends: every vereda holds variants of the technique that cannot fit into a first volume. This edition is offered as a starting point and as an open invitation to continue it.',
      },
    ],
  },

  partes: {
    1: {
      titulo: 'Roots and territory',
      subtitulo:
        'The history and wider context of fique: from the Guane people to the grassroots economy of today.',
      foto: 'cultivo_fique',
    },
    2: {
      titulo: 'From the earth to the loom',
      subtitulo:
        'The transformation of fique: botany, extraction, yield and the artisan craft.',
      foto: 'penga_fique_cortada',
    },
    3: {
      titulo: 'Woven horizons',
      subtitulo:
        'Conclusions: towards innovation, sustainability and the dignity of artisanal work.',
      foto: 'tejedor_trabajando_fique',
    },
  },

  laminas: {
    territorio: {
      foto: 'vista_panoramica_aratoca',
      titulo: 'The territory',
      pie: 'Aratoca, Santander. The town settles along the hillside, between the ridge of the mountain and the descent into the canyon. This broken geography shapes both daily life in the municipality and the way fique is sown and harvested.',
    },
    centro: {
      foto: 'toma_iglesia_aratoca',
      titulo: 'The centre of the municipality',
      pie: 'The parish church and main square of Aratoca. Around this core the fibre trade was organised for decades: bundles of cabuya arrived here from the veredas, and from here the sacks left for Boyacá and Cundinamarca.',
    },
    lavado: {
      foto: 'lavado_artesanal',
      titulo: 'Washing by hand',
      pie: 'After defibring, the cabuya is rinsed and drained to remove the remaining pulp. This is the phase that sets the colour and sheen of the fibre, and also the one that concentrates the greatest impact on the water sources of the vereda.',
    },
    desfibradora: {
      foto: 'hombre_trabajando_fique',
      titulo: 'Machine defibring',
      pie: 'The mechanical defibrer multiplies output per working day against manual varillado, but demands investment, maintenance and a fixed place of work. Between the two techniques — the bar and the machine — much of the sector’s productive future is being decided.',
    },
  },

  capitulos: {
    1: {
      ordinal: 'Chapter one',
      titulo: 'The legacy of the Guane people and the pre-Hispanic inheritance',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'Weaving with natural fibres has been a cornerstone of the culture and livelihood of the communities inhabiting present-day Colombia since pre-Hispanic times.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'In south-eastern Santander, as well as in parts of Cundinamarca and Boyacá, the Guane people stood out for their deep connection to the land and their remarkable manual skill. This culture, devoted chiefly to hunting and agriculture, developed a sophisticated visual expression through ceramics and textile work.',
        },
        {
          tipo: 'parrafo',
          texto:
            'The distinction between materials reveals a precise understanding of the properties of each fibre. While cotton was reserved for fine blankets and richly decorated outer garments, fique was the material of choice for everyday goods: headdresses, bags and mochilas (shoulder bags). It was not a hierarchy of prestige but an assignment by function. Cotton kept you warm; fique carried, resisted and lasted.',
        },
        { tipo: 'actividad', id: 'c1-algodon-o-fique' },
        {
          tipo: 'parrafo',
          texto:
            'That technical decision, taken centuries ago, still holds. The designs of those pieces bear a striking resemblance to the ones contemporary artisans continue to produce in Aratoca and the neighbouring municipalities. The shape of the mochila, the logic of the braid, the way an edge is finished: these are gestures that crossed the colonial period, the Republic and industrialisation without losing their essential structure.',
        },
        { tipo: 'subtitulo', texto: 'A scarce testimony, and invaluable for it' },
        {
          tipo: 'parrafo',
          texto:
            'Because the physical remains of Guane culture are scarce, the textile pieces that have survived hold incalculable anthropological value. Plant fibres are by nature perishable: they break down with damp, heat and time. That some have survived makes them living testimony to a technical mastery thousands of years old.',
        },
        { tipo: 'actividad', id: 'c1-vestigios' },
        {
          tipo: 'parrafo',
          texto:
            'This has a direct consequence for the present. Every artisan spinning and weaving fique in Aratoca today is not simply practising a trade: they are sustaining the only working version of that knowledge that remains.',
        },
        {
          tipo: 'cita',
          texto: 'Museums preserve the objects. Hands preserve the method.',
          fuente: 'On the transmission of fique knowledge',
        },
        { tipo: 'subtitulo', texto: 'From Guane territory to the municipality of Aratoca' },
        {
          tipo: 'parrafo',
          texto:
            'The history of Aratoca is deeply bound to the cultivation, processing and ancestral weaving of fique fibre. This tradition, inherited from the indigenous Guane culture, became for decades the economic engine and the main source of employment for thousands of rural families in the region.',
        },
        {
          tipo: 'parrafo',
          texto:
            'That continuity was not accidental. Fique thrives in poor, steep soils with low moisture retention — exactly the conditions that characterise much of Aratoca’s territory. Where other crops demand irrigation, flat ground or constant fertilising, fique settles in and persists. That fit between plant and landscape explains why the trade took root here so firmly and why it held for generations.',
        },
        {
          tipo: 'parrafo',
          texto:
            'A second condition was social: the knowledge was widely distributed. In Aratoca, much of the rural population learned to spin and weave fique from childhood, passing the knowledge from one generation to the next. There was no closed guild and no specialised workshop monopolising the technique. The knowledge lived in the houses.',
        },
        { tipo: 'actividad', id: 'c1-gremio' },
        {
          tipo: 'foto',
          foto: 'planta_y_montana',
          titulo: 'A vereda of Aratoca',
          pie: 'Fique grows along the roadsides and on the steepest slopes, occupying ground that would hardly admit any other crop. Its presence marks the boundary between what is sown and the wild.',
        },
      ],
    },

    2: {
      ordinal: 'Chapter two',
      titulo: 'A socio-economic overview: the grassroots fique economy',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'The fique ecosystem is still sustained by remarkably resilient communities. Cabuya production is the engine of a grassroots, campesino economy that withstood industrial substitution and is reinventing itself today.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'National cabuya production is concentrated in departments such as Santander, Nariño, Antioquia, Caldas and Boyacá. National figures have reported more than eighteen thousand hectares under cultivation, farmed almost entirely — around ninety-five per cent — by families of vulnerable socio-economic background and of indigenous or campesino descent.',
        },
        { tipo: 'actividad', id: 'c2-porcentaje-familias' },
        {
          tipo: 'datos',
          items: [
            { cifra: '18,000', leyenda: 'Hectares under cultivation reported nationally' },
            { cifra: '95%', leyenda: 'Farmed by campesino and indigenous families' },
            { cifra: '5', leyenda: 'Departments concentrate production' },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'That figure defines the character of the sector. Fique is not an agro-industrial crop: it is a family-economy crop, organised not around large plantations but around thousands of small units scattered across hillside land, where the labour is the family’s own.',
        },
        { tipo: 'subtitulo', texto: 'Santander: the fique provinces' },
        {
          tipo: 'parrafo',
          texto:
            'In Santander, fique is an ancestral and sustainable crop, fundamental to the department’s economy. It is concentrated in the provinces of Guanentá and Comunera — Mogotes, San Joaquín, Curití, Aratoca and Onzaga — where it represents the livelihood of thousands of campesino and artisan families.',
        },
        {
          tipo: 'parrafo',
          texto:
            'This territorial concentration produces technical proximity: the municipalities share varieties, tools, vocabulary and buyers. That informal learning network is one of the sector’s least recognised assets.',
        },
        { tipo: 'subtitulo', texto: 'The origins and the golden age in Aratoca' },
        {
          tipo: 'lineaTiempo',
          hitos: [
            {
              anio: 1900,
              titulo: 'Working by hand',
              texto:
                'The people of the area cultivated fique and processed its long leaves by hand to extract the fibre.',
            },
            {
              anio: 1920,
              titulo: 'The coffee boom',
              texto:
                'In the early twentieth century the work industrialised and gained great momentum thanks to the coffee boom. Coffee needed packaging: strong, breathable sacks able to withstand loading, the muleteer, the warehouse and the journey.',
            },
            {
              anio: 1950,
              titulo: 'The golden age',
              texto:
                'Aratoca came to be recognised as one of the department’s great producers of such packaging. Fique was not a secondary activity but the principal one for much of the rural population: the family calendar — cutting, defibring, washing, drying, spinning — organised the week.',
            },
            {
              anio: 1980,
              titulo: 'Synthetic substitution',
              texto:
                'Traditional sack production began to decline as it was replaced by synthetic fibres. Polypropylene was cheaper, lighter and easier to mass-produce. Within a few years the market that had sustained Aratoca for half a century contracted.',
            },
            {
              anio: 2026,
              titulo: 'Reinvention',
              texto:
                'Artisans, associations and bodies such as Artesanías de Colombia drove training to transform the fibre and find new destinations for the product. Fique work ceased to be confined to sacks and moved towards higher-value goods.',
            },
          ],
        },
        { tipo: 'subtitulo', texto: 'What is made today' },
        {
          tipo: 'lista',
          items: [
            {
              titulo: 'Decorative crafts',
              texto: 'Display pieces, table mats, basketry and objects for the home.',
            },
            {
              titulo: 'Bags and mochilas',
              texto: 'The fastest-moving product commercially, in strong demand among visitors and urban markets.',
            },
            {
              titulo: 'Rugs and table linen',
              texto: 'Larger pieces, demanding a loom and long working hours.',
            },
            {
              titulo: 'Alpargatas and other useful goods',
              texto: 'Traditional footwear whose braided sole keeps a highly specialised technique alive.',
            },
          ],
        },
        { tipo: 'subtitulo', texto: 'The pressures that still limit the sector' },
        {
          tipo: 'parrafo',
          texto:
            'Despite the cultural richness of the trade, the sector faces complex pressures worth naming precisely, because any public policy or strengthening project depends on that diagnosis: heavy dependence on intermediaries, who capture the margin and disconnect the artisan from the final price of their piece; low levels of formal employment, in predominantly family workshops with no contract and no record of time or costs; and the need to diversify the product, because dependence on the costal ralo keeps the sector tied to a low-price market under heavy synthetic competition.',
        },
        { tipo: 'actividad', id: 'c2-limitaciones' },
        {
          tipo: 'caja',
          rotulo: 'Institutional innovation in the province',
          parrafos: [
            'Fique is not only processed into sacks and agricultural packaging: it has been transformed through innovation. Local organisations such as Coohilados del Fonce in San Gil and Ecofibras in Curití work on transforming the fibre into crafts, decorative products, alpargata soles and even export goods.',
            'To this is added an attribute the contemporary market values more and more: it is a one hundred per cent biodegradable fibre, grown with very few inputs.',
          ],
        },
      ],
    },

    3: {
      ordinal: 'Chapter three',
      titulo: 'Furcraea: botany and life cycle',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'Fique is an imposing plant, native to Colombia and classified scientifically within the genus Furcraea sp., of which some twenty species exist.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'Its form is characterised by an upright stem from which spring long, fleshy leaves of an intense green, crowned at maturity by greenish-white flowers. The plant organises its growth as a rosette: new leaves are born at the centre and push the older ones outward, which descend and open until they lie almost horizontal.',
        },
        {
          tipo: 'parrafo',
          texto:
            'That architecture is what makes sustained use possible. Harvesting respects the plant’s biological cycle: growers cut the leaves nearest the base — the most mature, with the longest and strongest fibre — leaving a minimum of fifteen to twenty pencas in the cogollo to guarantee the survival and regeneration of the plant.',
        },
        { tipo: 'actividad', id: 'c3-cogollo' },
        {
          tipo: 'caja',
          rotulo: 'The rule of the cogollo',
          parrafos: [
            'Leaving between fifteen and twenty pencas in the cogollo is not an external technical recommendation: it is a criterion built by the growers themselves out of accumulated observation. Cutting below that threshold compromises the plant’s photosynthetic capacity, delays the production of new leaves and, in severe cases, kills it.',
            'It is, in practice, a sustainable management rule passed on orally for generations, long before any formal vocabulary existed to name it.',
          ],
        },
        { tipo: 'subtitulo', texto: 'The maguey: the end of the cycle' },
        {
          tipo: 'parrafo',
          texto:
            'At the end of its useful life the plant sends up from its centre a long flower stalk that can rise several times the height of the rosette. In local speech, that structure and the plant that produces it are both known as maguey. Its appearance announces the close of the cycle: the plant concentrates its reserves in flowering and, after it, dies.',
        },
        { tipo: 'actividad', id: 'c3-floracion' },
        {
          tipo: 'foto',
          foto: 'maguey',
          titulo: 'The mast of the maguey',
          pie: 'The flower stalk rises far above the surrounding scrub and becomes visible from a great distance. Growers read it as a clock: it marks which plants are closing their productive cycle.',
        },
        {
          tipo: 'parrafo',
          texto:
            'This outcome forces the crop to be thought of in terms of succession. A fique plantation is sustained not by the longevity of its individuals but by staggered renewal: while some plants produce, others grow and others flower. A grower who only harvests, without planting replacements, condemns the plot to a gradual emptying.',
        },
        { tipo: 'subtitulo', texto: 'Growing conditions' },
        {
          tipo: 'parrafo',
          texto:
            'Fique adapts to soils of low fertility and to steep ground where mechanisation is impossible. It needs little water, demands no permanent irrigation and tolerates long dry spells. These characteristics historically made it the crop of the land no other product wanted.',
        },
        { tipo: 'actividad', id: 'c3-riego' },
        {
          tipo: 'parrafo',
          texto:
            'There is also an environmental benefit frequently overlooked: through its root system and its arrangement on the slopes, fique plantations contribute to holding the soil and containing erosion on steep ground, of the kind that characterises much of Aratoca’s territory.',
        },
        { tipo: 'subtitulo', texto: 'From leaf to fibre' },
        {
          tipo: 'parrafo',
          texto:
            'Within the penca, the fibre is organised in longitudinal bundles embedded in fleshy, watery tissue. The whole process of transformation described in the next chapter consists, essentially, of one operation repeated with different tools: separating the bundle from the pulp without breaking it. The length, sheen, colour and strength of the final thread all depend on how cleanly that separation is achieved. It is there, in large part, that the commercial value of the finished piece is decided.',
        },
      ],
    },

    4: {
      ordinal: 'Chapter four',
      titulo: 'Extraction and yield: the environmental challenge of bagazo',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'Once the leaves are gathered, a process of transformation begins that presents one of the greatest technical and environmental challenges for the sector.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'During defibring, only around four per cent of the total weight of the leaf is recovered as usable fibre, that is, as cabuya. The remaining ninety-six per cent becomes residual biomass, known colloquially as bagazo.',
        },
        { tipo: 'actividad', id: 'c4-rendimiento' },
        {
          tipo: 'datos',
          items: [
            { cifra: '4%', leyenda: 'Of the leaf is recovered as usable fibre (cabuya)' },
            { cifra: '96%', leyenda: 'Becomes residual biomass, or bagazo' },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'The scale of that proportion is hard to overstate. For every arroba of fibre leaving a plot, several times that weight in wet plant material remains on the ground and at the washing point. Traditionally this by-product has gone unused.',
        },
        { tipo: 'subtitulo', texto: 'The impact on water sources' },
        {
          tipo: 'parrafo',
          texto:
            'The problem is not only one of volume but of destination. Because of how the fibre is washed, the juices of the bagazo are usually discharged into water sources, causing negative environmental impacts on the streams and springs that, on hillside land, supply the very veredas where the fibre is processed.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Recognising this is not an accusation against the producing families. It is the acknowledgement of a technical gap: for decades there was no available, affordable and practicable alternative for disposing of that residue. Water was the only vehicle at hand.',
        },
        { tipo: 'subtitulo', texto: 'The phases of the transformation process' },
        {
          tipo: 'parrafo',
          texto:
            'The path from the cut penca to the finished thread comprises six clearly distinct phases. Each has its own timings, tools and quality criteria.',
        },
        {
          tipo: 'fases',
          items: [
            {
              titulo: 'Harvest',
              texto:
                'The mature leaves are cut from the fique plant and sorted by quality. The pencas at the base are preferred, being longer and more mature, always respecting the minimum of fifteen to twenty leaves in the cogollo.',
            },
            {
              titulo: 'Extraction, or defibring',
              texto:
                'The fibre is separated from the fleshy mass of the leaf. This can be done by varillado — the traditional manual method, in which the penca is scraped against a fixed bar until the pulp comes away — or by machine, using mechanical defibrers that raise output per working day.',
            },
            {
              titulo: 'Washing and drying',
              texto:
                'The extracted fibres are submerged in water for twelve to fifteen hours, washed to remove remaining pulp and adhering juices, and then spread in the sun to dry. The final colour of the cabuya depends directly on this phase: incomplete washing, or drying in shade, darkens and stains the fibre.',
            },
            {
              titulo: 'Escarmenado and combing',
              texto:
                'The dried bundles are drawn through a nail comb to untangle, polish and clean the fibre. The operation aligns the filaments in one direction and separates the long fibre — the more valuable — from the short and broken, which goes to secondary uses.',
            },
            {
              titulo: 'Spinning',
              texto:
                'The process in which the fibre is twisted into thread. The strength and destination of the cabuya depend on the thickness and tension of that twist: fine thread for detailed weaving, thick thread for packaging and soles. If desired, the fibre is dyed at this stage with natural or artificial colours.',
            },
            {
              titulo: 'Finishing',
              texto:
                'The thread is woven on looms, with crochet hooks or by machine to create useful goods such as sacks, bags, table linen, rugs or handmade paper. This is the phase where design is concentrated and where, consequently, the greatest share of the chain’s added value is generated.',
            },
          ],
        },
        { tipo: 'actividad', id: 'c4-remojo' },
        {
          tipo: 'caja',
          rotulo: 'The critical point of the process',
          parrafos: [
            'Washing is simultaneously the phase that defines the commercial quality of the fibre and the one that concentrates the greatest environmental impact of the trade. Any technical improvement at this point — recirculating the water, settling tanks, capturing the juices for composting — has a double effect: it improves the product and protects the stream.',
          ],
        },
        { tipo: 'subtitulo', texto: 'Bagazo as an opportunity' },
        {
          tipo: 'parrafo',
          texto:
            'Recent research indicates that the residual material from defibring holds enormous potential for making natural insecticides, organic fertilisers, agrotextiles and biomats, opening the door to a circular bioeconomy.',
        },
        { tipo: 'actividad', id: 'c4-bagazo-usos' },
        {
          tipo: 'parrafo',
          texto:
            'The shift in outlook this implies is profound. What is discarded today as waste — and which also creates an environmental liability — could become a second line of income for the same family already doing the defibring, without planting a single additional hectare. The input is already there, produced and available.',
        },
        {
          tipo: 'cita',
          texto:
            'The ninety-six per cent lost today is the fique sector’s largest untapped reserve.',
          fuente: 'On making use of the bagazo',
        },
      ],
    },

    5: {
      ordinal: 'Chapter five',
      titulo: 'The artisan craft: tools, looms and the passing on of knowledge',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'In artisanal transformation, the trade is sustained by oral transmission from one generation to the next. There is no manual: there is a master, an apprentice and repetition.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'Most artisans work at the spinning stage, using hand tools and rustic horizontal looms. These are devices built locally, from materials at hand, fitted to the person who uses them and repaired by that same person. That technical autonomy — being able to make and maintain your own tool — is inseparable from the craft.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Although a large proportion of the thread goes into agricultural packaging, a valuable share is turned into diversified crafts such as rugs, hats, table mats and alpargatas. The difference between one destination and the other lies not in the fibre but in the design decision and the working time given to it.',
        },
        {
          tipo: 'foto',
          foto: 'uso_artesanal_fique',
          titulo: 'The tool of varillado',
          pie: 'A bar lashed to a tree trunk is enough to set up the workstation. The artisan holds the penca against the bar and draws it until the pulp comes away. All the technology of the process fits into a well-tied knot.',
        },
        { tipo: 'subtitulo', texto: 'The gesture of varillado' },
        {
          tipo: 'parrafo',
          texto:
            'Varillado demands a precise combination of force and control. Too much pressure breaks the filaments and produces short, lower-value fibre; too little leaves pulp adhering, which darkens the cabuya as it dries. That middle point is not explained: it is calibrated over years of practice and corrected, in learning, with the master’s hand over the apprentice’s.',
        },
        { tipo: 'actividad', id: 'c5-varillado' },
        {
          tipo: 'parrafo',
          texto:
            'This is why the loss of an older artisan is not only a loss of affection for the community. It is the loss of a set of criteria written down nowhere: how to recognise a penca at its point, how long to leave the fibre in the water given the week’s weather, how to read the colour of the drying.',
        },
        {
          tipo: 'foto',
          foto: 'hombre_manipulando_fique',
          titulo: 'Extraction by hand',
          pie: 'The fibre comes out of the penca in a single continuous movement. The quality of the bundle is judged in that instant: length, cleanliness and the absence of broken filaments.',
        },
        { tipo: 'subtitulo', texto: 'From loom to product' },
        {
          tipo: 'parrafo',
          texto:
            'In finishing, the horizontal loom remains the dominant tool for larger pieces. The crochet hook, more versatile and portable, allows work in fragmented time — between the tasks of the house and those of the plot — and for that reason accounts for much of the production of bags and accessories.',
        },
        { tipo: 'actividad', id: 'c5-ganchillo' },
        { tipo: 'subtitulo', texto: 'Association as a tool of survival' },
        {
          tipo: 'parrafo',
          texto:
            'At this stage, association has proved a key tool of survival, allowing communities to preserve traditional techniques such as natural dyeing and to keep the family workshop alive. Its usefulness is concrete and verifiable. Associating allows inputs to be bought in volume and at better prices; equipment to be shared that no family could acquire alone; a common quality standard to be maintained, which makes large orders possible; and, above all, direct negotiation with the final buyer, reducing dependence on the intermediary.',
        },
        { tipo: 'actividad', id: 'c5-asociatividad' },
        {
          tipo: 'caja',
          rotulo: 'What is lost without organisation',
          parrafos: [
            'A lone artisan sells what they manage to produce and accepts the price offered. An organised group sells a catalogue, holds stock, meets a firm order and sets a price based on real costs. The difference is not one of scale: it is one of position in the chain.',
          ],
        },
        { tipo: 'subtitulo', texto: 'Dyeing: colour and territory' },
        {
          tipo: 'parrafo',
          texto:
            'Natural dyeing, using pigments obtained from plants and minerals of the region, is one of the most fragile forms of knowledge in the trade and, at the same time, one with the greatest distinguishing potential in the contemporary market. Each recipe — which plant, in what proportion, for how long, at what temperature — is local knowledge that cannot be reproduced industrially without losing its character.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Documenting those recipes, with the name of whoever contributes them and the detail of their proportions, is one of the most urgent tasks facing any effort to safeguard the fique trade in Aratoca.',
        },
        {
          tipo: 'cita',
          texto:
            'Knowledge is not lost all at once. It is lost recipe by recipe, name by name, hand by hand.',
          fuente: 'On safeguarding the trade',
        },
      ],
    },

    6: {
      ordinal: 'Chapter six',
      titulo: 'Closing reflections: towards innovation and sustainability',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'Strengthening the productive fabric of municipalities with a fique tradition, as Aratoca has, calls for an integrated view that fuses respect for the inheritance with the urgency of innovation.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'The preceding pages described a trade of uncommon historical depth and of equally notable present fragility. Both are true at once, and any reading that sacrifices one of them produces an incomplete diagnosis: celebration without diagnosis changes nothing, and diagnosis without recognition of cultural value leads to abandonment.',
        },
        {
          tipo: 'parrafo',
          texto:
            'It is essential to move beyond low-yield technologies and to mitigate the environmental impacts of processing the leaf. At the same time, community organisation must aim at the dignity of artisanal work, reducing dependence on intermediaries and driving the creation of added value.',
        },
        { tipo: 'subtitulo', texto: 'Four fronts of work' },
        {
          tipo: 'parrafo',
          texto:
            'From all of the above follow four lines of action which are simultaneous rather than sequential: none of them bears fruit if the others are neglected.',
        },
        {
          tipo: 'lista',
          items: [
            {
              titulo: 'Technical yield',
              texto:
                'Improve defibring and washing without displacing the artisan from their own process or imposing technologies the territory cannot maintain.',
            },
            {
              titulo: 'Environmental management of the bagazo',
              texto:
                'Turn the residual ninety-six per cent into fertilisers, agrotextiles and biomats, while protecting the streams and springs of the veredas.',
            },
            {
              titulo: 'Added value and design',
              texto:
                'Diversify beyond the costal ralo towards products that incorporate contemporary design without abandoning the technique that makes them unique.',
            },
            {
              titulo: 'Direct selling',
              texto:
                'Shorten the chain of intermediation through association, digital channels and a presence at fairs, so the margin stays in the workshop.',
            },
          ],
        },
        { tipo: 'actividad', id: 'c6-frentes' },
        { tipo: 'subtitulo', texto: 'Generational succession' },
        {
          tipo: 'parrafo',
          texto:
            'None of the lines above means anything if there is no one to carry them out in twenty years. The most serious challenge facing the fique trade is neither technological nor commercial: it is demographic. Those who hold the knowledge are ageing, and younger generations do not find in the trade, structured as it is today, an income comparable to migration.',
        },
        { tipo: 'actividad', id: 'c6-desafio' },
        {
          tipo: 'parrafo',
          texto:
            'Reversing that requires fique to stop being presented to young people as an inheritance to be preserved out of duty and to start being presented as what it can become: a material in growing demand in markets that value the biodegradable, the traceable and the handmade. The conversation changes entirely when the argument stops being nostalgia and becomes opportunity.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Intergenerational encounter is, in that sense, the most effective safeguarding mechanism available. Older artisans bring technical judgement and memory; young people bring visual language, command of digital tools and access to sales channels that did not exist before. Neither group can sustain the trade alone.',
        },
        { tipo: 'actividad', id: 'c6-quien-aporta' },
        {
          tipo: 'caja',
          rotulo: 'One concrete and urgent task',
          parrafos: [
            'Document. Record on audio and video the techniques of the masters active today; write down the natural dyeing recipes with the name of whoever holds them; draw up sheets for each process with real materials, times and costs.',
            'It is the lowest-cost and highest-return task of all those listed in this chapter, and the only one whose window closes by itself with the passing of time.',
          ],
        },
        { tipo: 'subtitulo', texto: 'A vehicle of identity' },
        {
          tipo: 'parrafo',
          texto:
            'Fique is not only a raw material: it is a vehicle of community identity which, combined with enterprise and fresh technical perspectives, can generate real and sustainable sources of income for the people who live here.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Aratoca has in its favour a combination few municipalities can claim: living technical knowledge, a recognisable productive landscape, a strategic position on the canyon’s tourist corridor, and a documented tradition reaching back to the Guane people. The challenge is not to invent a future for fique, but to organise the one already happening in the workshops of the municipality.',
        },
        {
          tipo: 'cita',
          texto:
            'Preserving that knowledge is not looking backwards. It is making sure Aratoca keeps something it does better than anyone.',
          fuente: 'Close of the third part',
        },
      ],
    },
  },

  glosario: {
    titulo: 'Glossary of the fique trade',
    intro:
      'Gathered here are the terms used throughout the book, in the sense the artisans and growers of Aratoca and the province of Guanentá give them. They are grouped by stage of the trade rather than alphabetically, so that they can be read following the path of the fibre.',
    grupos: [
      {
        titulo: 'The plant and the crop',
        terminos: [
          { termino: 'Furcraea', definicion: 'The botanical genus fique belongs to, native to Colombia, with around twenty described species.' },
          { termino: 'Penca', definicion: 'The leaf of the fique. Long, fleshy and spiny-edged; it is the unit of harvest.' },
          { termino: 'Cogollo', definicion: 'The young leaves at the centre of the plant. Between fifteen and twenty pencas are kept to guarantee regeneration.' },
          { termino: 'Mata', definicion: 'An individual fique plant, considered as a productive unit within the plot.' },
          { termino: 'Maguey', definicion: 'Local name for the fique plant and, in particular, for the long flower stalk it sends up as it closes its life cycle.' },
        ],
      },
      {
        titulo: 'Extraction and the fibre',
        terminos: [
          { termino: 'Desfibrado', definicion: 'Defibring: separating the fibre from the fleshy mass of the leaf. It may be manual (varillado) or by machine.' },
          { termino: 'Varillado', definicion: 'The traditional manual method of defibring, in which the penca is scraped against a fixed bar until the pulp comes away.' },
          { termino: 'Desfibradora', definicion: 'The machine that separates the fibre mechanically, raising output per working day against varillado.' },
          { termino: 'Cabuya', definicion: 'The usable fibre extracted from the fique penca, and by extension the thread made from it.' },
          { termino: 'Manojo', definicion: 'The working unit of fibre: a tied bundle of filaments that is washed, dried and sold together.' },
          { termino: 'Escarmenado', definicion: 'Drawing the dried bundle through a nail comb to untangle, polish, clean and align the fibre.' },
          { termino: 'Hilado', definicion: 'Spinning: twisting the fibre into thread. Thickness and tension determine the destination and value of the cabuya.' },
        ],
      },
      {
        titulo: 'The workshop and the products',
        terminos: [
          { termino: 'Telar horizontal', definicion: 'Horizontal loom. A wooden structure, generally built locally, used to weave larger pieces such as rugs and table linen.' },
          { termino: 'Ganchillo', definicion: 'A single-needle crochet hook, used above all in the production of bags and accessories.' },
          { termino: 'Teñido natural', definicion: 'Natural dyeing: colouring the fibre with pigments from plants and minerals of the region, following orally transmitted recipes.' },
          { termino: 'Costal ralo', definicion: 'An open-weave agricultural sack, the sector’s traditional product, now largely replaced by synthetic fibres.' },
          { termino: 'Alpargata', definicion: 'Traditional footwear with a braided fique sole. Its making concentrates one of the most specialised techniques of the trade.' },
          { termino: 'Individual', definicion: 'A small woven table mat; together with rugs and table linen it makes up the home decoration line.' },
        ],
      },
      {
        titulo: 'Use and sustainability',
        terminos: [
          { termino: 'Bagazo', definicion: 'The residual biomass left after defibring. It accounts for around ninety-six per cent of the weight of the leaf.' },
          { termino: 'Abono orgánico', definicion: 'Organic fertiliser obtained from the controlled decomposition of plant material; one of the possible destinations of bagazo.' },
          { termino: 'Agrotextil', definicion: 'An agricultural textile used to cover, protect or support crops; it can be made from fique fibre and residue.' },
          { termino: 'Biomanto', definicion: 'A biodegradable plant mat used to control erosion and stabilise slopes, especially useful on steep ground.' },
          { termino: 'Bioeconomía circular', definicion: 'Circular bioeconomy: a model in which the residues of one process become the inputs of another, eliminating the notion of waste.' },
        ],
      },
    ],
  },

  fuentes: {
    titulo: 'Sources and references',
    bloques: [
      { tipo: 'subtitulo', texto: 'On the making of this book' },
      {
        tipo: 'parrafo',
        texto:
          'The contents of this first edition were built from three kinds of source: territorial documentation carried out in the municipality of Aratoca; a review of publicly available information on the Colombian fique sector; and the testimony of growers and artisans of the municipality, gathered during the photographic record that illustrates these pages.',
      },
      { tipo: 'subtitulo', texto: 'Bodies and organisations mentioned' },
      {
        tipo: 'lista',
        items: [
          { titulo: 'Artesanías de Colombia', texto: 'A body that has driven training and fibre-transformation processes in the country’s artisan communities.' },
          { titulo: 'Coohilados del Fonce', texto: 'An organisation based in San Gil, Santander, dedicated to transforming fique fibre.' },
          { titulo: 'Ecofibras', texto: 'An organisation based in Curití, Santander, producing crafts and goods derived from fique.' },
          { titulo: 'Ministerio de las Culturas, las Artes y los Saberes', texto: 'The body governing the National Cultural Cooperation Programme, the framework of the project behind this publication.' },
        ],
      },
      { tipo: 'subtitulo', texto: 'Municipalities of the Santander fique belt' },
      {
        tipo: 'parrafo',
        texto:
          'The provinces of Guanentá and Comunera concentrate the department’s production. The municipalities referenced throughout the work are Aratoca, Curití, Mogotes, Onzaga, San Gil and San Joaquín.',
      },
      {
        tipo: 'caja',
        rotulo: 'An invitation to complete this edition',
        parrafos: [
          'This work is conceived as an open document. Artisans, growers, teachers and researchers who wish to contribute corrections, testimony, dyeing recipes or process sheets may write to the Department of Culture of the Municipal Government of Aratoca, with a view to an expanded second edition.',
        ],
      },
    ],
  },

  creditos: {
    titulo: 'Photographic credits',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'All the photographs in this edition were taken in the municipality of Aratoca, Santander.',
      },
      {
        tipo: 'lista',
        items: [
          { titulo: 'Cover', texto: 'A fique plant in flower beside the country road, with the canyon behind.' },
          { titulo: 'Plate “The territory”', texto: 'Panoramic view of the town of Aratoca from the hillside.' },
          { titulo: 'Part I opener', texto: 'Cultivated slope and country road on the flank of the canyon.' },
          { titulo: 'Chapter 1', texto: 'A fique plant at the roadside, on steep ground.' },
          { titulo: 'Plate “The centre of the municipality”', texto: 'The parish church and main square of Aratoca.' },
          { titulo: 'Part II opener', texto: 'Freshly cut fique pencas laid beside the road.' },
          { titulo: 'Chapter 3', texto: 'The flowering mast of the maguey above the canyon landscape.' },
          { titulo: 'Chapter 5', texto: 'The varillado bar lashed to a trunk; extracting the fibre by hand.' },
          { titulo: 'Plate “Washing by hand”', texto: 'Rinsing and draining the fibre at the washing point.' },
          { titulo: 'Plate “Machine defibring”', texto: 'A mechanical defibrer on a plot in the municipality.' },
          { titulo: 'Part III opener', texto: 'An artisan working the fibre on the hillside.' },
        ],
      },
      { tipo: 'subtitulo', texto: 'A note on the figures' },
      {
        tipo: 'parrafo',
        texto:
          'The quantitative data cited in the second and fourth chapters — hectares under cultivation nationally, the share of campesino and indigenous families in the crop, and fibre yield per leaf processed — correspond to the orders of magnitude reported for the Colombian fique sector, and are given as context rather than as a local measurement of the municipality of Aratoca.',
      },
      {
        tipo: 'caja',
        rotulo: 'Acknowledgement',
        parrafos: [
          'The Municipal Government of Aratoca thanks the growing and artisan families who allowed their work to be photographed in the plot and in the workshop. Without that openness this book would not exist.',
          'This work was made possible by the fique-growing, defibring, spinning and weaving families of Aratoca, who opened their plots, their workshops and their memory.',
        ],
      },
    ],
  },

  colofon: {
    parrafos: [
      'The knowledge documented here is the collective heritage of the artisan communities of Aratoca and the province of Guanentá. Reproduction in whole or in part is authorised for educational, community and non-commercial purposes, citing the source.',
      'Distributed free of charge. Not for sale.',
      'An institutional publication of the Municipal Government of Aratoca, within the project “Fique Crafts Workshop: creativity, tradition and enterprise in Aratoca”.',
    ],
  },

  contracubierta: {
    parrafos: [
      'For generations, fique in Aratoca was far more than a crop: it was the trade that kept the household going and the thread that drew together the campesino families of the province of Guanentá.',
      'This book gathers, for the first time in a single volume, the long history of that fibre — from the inheritance of the Guane people to the crisis of the 1980s and today’s reinvention — the technical description of the six phases that run from the penca to the loom, and a frank reading of the challenges the sector faces.',
      'It is not a nostalgic tribute. It is a working tool for artisans, young people, teachers and cultural managers who want to understand — and transform — the productive present of the municipality.',
    ],
  },

  cierre: {
    titulo: 'End of the journey',
    intro:
      'You have reached the end of “Trenzando Saberes”. The book is offered as a starting point: what is documented here goes on happening, every day, in the workshops and plots of the municipality.',
    resumen: 'You answered {{respondidas}} of {{total}} activities, and got {{aciertos}} right first time.',
    sinRespuestas:
      'You have not answered any activities yet. Feel free to go back and try them: they are not graded, they are there to think with.',
    reiniciar: 'Start again',
  },

  enhorabuena: {
    titulo: 'Congratulations!',
    texto:
      'Thank you for coming this far: your workshop is over. This last page exists only because the leaves of a book have two sides, and this one was missing its own. Make the most of it — it is yours.',
    boton: 'Close the book',
  },

  actividades: {
    'c1-algodon-o-fique': {
      pregunta: 'The Guane assigned each fibre to a different use. Which does each piece belong to?',
      grupos: ['Cotton', 'Fique'],
      items: ['Fine blankets', 'Mochilas', 'Outer garments', 'Headdresses', 'Bags'],
      explicacion:
        'It was not a hierarchy of prestige but an assignment by function: cotton kept you warm; fique carried, resisted and lasted.',
    },
    'c1-gremio': {
      pregunta: 'In Aratoca, a closed guild kept the technique of fique to itself.',
      explicacion:
        'False. There was no closed guild and no specialised workshop monopolising the technique: much of the rural population learned to spin and weave from childhood. The knowledge lived in the houses.',
    },
    'c1-vestigios': {
      pregunta: 'Do many textile pieces of the Guane people survive today?',
      explicacion:
        'No. Plant fibres are perishable: they break down with damp, heat and time. That is precisely why the few that survived hold incalculable anthropological value.',
    },

    'c2-porcentaje-familias': {
      pregunta: 'What share of the country’s fique is grown by campesino and indigenous families?',
      unidad: '%',
      tramos: [
        'More than you think: fique is not an agro-industrial crop.',
        'Around ninety-five per cent. It is a family-economy crop.',
        'Almost there: the reported figure is around ninety-five per cent.',
      ],
      explicacion:
        'Around 95% of the national fique crop is grown by families of vulnerable background and of indigenous or campesino descent, across thousands of small units scattered on hillside land.',
    },
    'c2-limitaciones': {
      pregunta: 'What pressures limit the fique sector today? Select all that apply.',
      opciones: [
        'Heavy dependence on intermediaries',
        'Low levels of formal employment',
        'The need to diversify the product',
        'A shortage of arable land',
        'Too much water on the plots',
      ],
      explicacion:
        'The first three are the ones the chapter names. Fique grows precisely on the land no other crop wanted, and needs little water: neither land nor irrigation is the problem.',
    },

    'c3-cogollo': {
      pregunta: 'You are harvesting a fique plant. How many pencas do you leave in the cogollo?',
      unidad: 'pencas',
      tramos: [
        'Too few. The plant loses photosynthetic capacity, is slow to produce new leaves and may die.',
        'That is the point. Between fifteen and twenty pencas guarantee the plant’s survival and regeneration.',
        'The plant survives, but you are leaving uncut pencas that were already at their point.',
      ],
      explicacion:
        'Leaving between fifteen and twenty pencas in the cogollo is not an external recommendation: it is a criterion built by the growers themselves out of accumulated observation, passed on orally for generations.',
    },
    'c3-floracion': {
      pregunta: 'After flowering, the fique plant produces leaves again.',
      explicacion:
        'False. The appearance of the maguey announces the close of the cycle: the plant concentrates its reserves in flowering and, after it, dies. That is why the crop is sustained by staggered renewal rather than by the longevity of each plant.',
    },
    'c3-riego': {
      pregunta: 'Does fique need permanent irrigation?',
      explicacion:
        'No. It needs little water, tolerates long dry spells and adapts to soils of low fertility and steep ground. That is what historically made it the crop of the land no other product wanted.',
    },

    'c4-rendimiento': {
      pregunta: 'Of a freshly cut fique leaf, how much is recovered as usable fibre?',
      unidad: '%',
      tramos: [
        'A little more, but not much more.',
        'Around four per cent. Everything else is bagazo.',
        'Considerably less. The real yield surprises almost everyone.',
      ],
      explicacion:
        'Only 4% of the weight of the leaf becomes cabuya. The remaining 96% is residual biomass — the bagazo — and it is at once the trade’s greatest environmental problem and its largest untapped reserve.',
    },
    'c4-bagazo-usos': {
      pregunta: 'What can be produced from bagazo? Select all that apply.',
      opciones: [
        'Natural insecticides',
        'Organic fertilisers',
        'Agrotextiles',
        'Biomats for erosion control',
        'Fuel for engines',
      ],
      explicacion:
        'The first four are the ones recent research points to, and they open the door to a circular bioeconomy: the input is already there, produced and available, without planting an additional hectare.',
    },
    'c4-remojo': {
      pregunta: 'How many hours should the fibre stay submerged before drying?',
      unidad: 'hours',
      tramos: [
        'Too little time: pulp and adhering juices remain, and they darken and stain the cabuya.',
        'Correct. Twelve to fifteen hours remove the pulp without punishing the fibre.',
        'Longer than necessary, using more water for no gain in quality.',
      ],
      explicacion:
        'Washing is the critical point of the process: it defines the commercial quality of the fibre and concentrates, at the same time, the trade’s greatest environmental impact on the streams of the vereda.',
    },

    'c5-varillado': {
      pregunta: 'You are drawing a penca against the bar. How much pressure do you apply?',
      unidad: '',
      tramos: [
        'Light pressure: pulp remains adhering, and it will darken the cabuya as it dries.',
        'That is the middle point: the fibre comes away clean, long and whole.',
        'Too much pressure: the filaments break and you are left with short, lower-value fibre.',
      ],
      explicacion:
        'Varillado demands a precise combination of force and control. That middle point is not explained: it is calibrated over years of practice and corrected, in learning, with the master’s hand over the apprentice’s.',
    },
    'c5-asociatividad': {
      pregunta: 'What does association allow a family workshop to do? Select all that apply.',
      opciones: [
        'Buy inputs in volume and at better prices',
        'Share equipment no family could acquire alone',
        'Maintain a common quality standard',
        'Negotiate directly with the final buyer',
        'Do away with the need for natural dyeing',
      ],
      explicacion:
        'The first four. Association does not replace techniques: on the contrary, it is precisely what has allowed fragile knowledge such as natural dyeing to be preserved. The difference is not one of scale, it is one of position in the chain.',
    },
    'c5-ganchillo': {
      pregunta: 'Would you use a crochet hook to weave a large rug?',
      explicacion:
        'No. For larger pieces the horizontal loom remains the dominant tool. The crochet hook, more versatile and portable, accounts for the production of bags and accessories because it allows work in fragmented time.',
    },

    'c6-frentes': {
      pregunta: 'Which of these fronts of work does the book propose? Select all that apply.',
      opciones: [
        'Technical yield',
        'Environmental management of the bagazo',
        'Added value and design',
        'Direct selling',
      ],
      explicacion:
        'All four. And the chapter insists on something more: they are simultaneous rather than sequential. None of them bears fruit if the others are neglected.',
    },
    'c6-desafio': {
      pregunta: 'The greatest challenge facing the fique trade today is technological.',
      explicacion:
        'False. The most serious challenge is neither technological nor commercial: it is demographic. Those who hold the knowledge are ageing, and younger generations do not find in the trade, structured as it is today, an income comparable to migration.',
    },
    'c6-quien-aporta': {
      pregunta: 'In the intergenerational encounter, what does each group bring?',
      grupos: ['Older artisans', 'Young people'],
      items: [
        'Technical judgement',
        'Memory of the trade',
        'Visual language',
        'Command of digital tools',
        'Access to sales channels',
      ],
      explicacion:
        'Neither group can sustain the trade alone. That is why intergenerational encounter is the most effective safeguarding mechanism available.',
    },
    /* --- Glossary · vocabulary review --- */
    'g-terminos-etapa': {
      pregunta: 'Each term belongs to a stage of the craft. Where does each one go?',
      grupos: ['The plant and the crop', 'The workshop and its products'],
      items: ['Cogollo', 'Alpargata', 'Penca', 'Horizontal loom', 'Maguey', 'Crochet hook'],
      explicacion:
        'Cogollo, penca and maguey name parts and moments of the plant; the alpargata, the horizontal loom and the crochet hook belong to the workshop. The glossary follows that same path: first the plant, then the fibre, finally the product.',
    },
    'g-varillado': {
      pregunta: 'What is varillado?',
      opciones: [
        'Twisting the fibre to form thread',
        'Scraping the leaf against a fixed rod until the pulp comes away',
        'Passing the dry bundle through a nail brush',
        'Soaking the fibre in water before drying it',
      ],
      explicacion:
        'Varillado is manual, traditional defibring. The other three exist too, but they are spinning, combing and soaking: different stages of the same journey.',
    },
    'g-cabuya': {
      pregunta: 'What exactly is cabuya?',
      opciones: [
        'The whole fique leaf',
        'The residue left after defibring',
        'The usable fibre drawn from the leaf, and the thread made from it',
        'The flower stalk the plant sends up at the end of its life',
      ],
      explicacion:
        'The leaf is the penca, the residue is the bagasse and the flower stalk is the maguey. Cabuya is what remains once fibre is separated from pulp: barely four per cent of the leaf by weight.',
    },
    'g-escarmenado': {
      pregunta: 'Combing takes place before the fibre is washed.',
      explicacion:
        'False. Combing comes afterwards: the nail brush is passed through a bundle that has already been washed and dried. Brushing fibre while it is wet and still carrying pulp would tear it rather than comb it.',
    },
    'g-costal-ralo': {
      pregunta: 'Is the coarse sack still the main fique product in Aratoca?',
      explicacion:
        'No. From the 1980s onwards synthetic fibres replaced it almost entirely, and the craft turned towards bags, mochilas, rugs, alpargatas and decorative work: products carrying far more added value.',
    },
    'g-biomanto': {
      pregunta: 'What is a bio-blanket for?',
      opciones: [
        'Controlling erosion and stabilising slopes',
        'Dyeing the fibre with natural pigments',
        'Transporting coffee and potatoes',
        'Combing and aligning the filaments',
      ],
      explicacion:
        'It is a biodegradable plant matting that holds soil on steep ground — precisely the ground Aratoca is made of. It is one of the possible destinations for bagasse, the ninety-six per cent of the leaf discarded today.',
    },
  },

};
