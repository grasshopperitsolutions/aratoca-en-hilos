/**
 * "Trenzando Saberes" — Spanish, the language of record.
 *
 * A merge of the client's two manuscripts, at their request. Version 2
 * (`trenzando_saberes_version2_es.docx`, Aug 2026) supplies the structure, the
 * chapter titles and the tagged photographic catalogue. Version 1 and the
 * original `Borrador libro.docx` supply everything version 2 dropped: the eight
 * pull-out boxes, the seven-module curriculum, the synopsis, and several
 * paragraphs — the 1980s reinvention of the trade, the flowering cycle of the
 * Furcraea, and the closing reflections of chapter 6.
 *
 * Every sentence is the client's own. The only editorial liberties are
 * typographic: long blocks are split into paragraphs at existing sentence
 * boundaries, part titles are split at their own colon into `titulo` /
 * `subtitulo`, and straight quotes are replaced with the angle quotes Spanish
 * typography uses. This is an official Alcaldía publication; the words are
 * theirs, not ours.
 *
 * Asset captions (`pie`) and alt text are ours: the manuscript describes each
 * photograph as a production brief for the photographer, not as reader-facing
 * copy, so those briefs are condensed here into a caption a visitor would want
 * and an alt text a screen reader can use.
 */

import type { LibroTexto } from '../../types/libro';

export const LIBRO_ES: LibroTexto = {
  titulo: 'Trenzando Saberes',
  subtitulo: 'Historia, Transformación y Futuro del Fique en Santander',
  editor: 'Alcaldía Municipal de Aratoca, Santander',
  version: 'Guía de Aprendizaje e Integración Digital · Versión 2.0 · 2026',
  sinopsis:
    'La presente obra busca revitalizar y salvaguardar los conocimientos ancestrales y tradicionales asociados al cultivo y transformación del fique, entendidos no solo como un oficio, sino como el núcleo de la economía popular y la identidad cultural de las comunidades artesanas de Santander, con especial énfasis en el municipio de Aratoca. En una primera instancia, el texto traza un recorrido histórico desde las prácticas originarias del pueblo Guane hasta el panorama socioeconómico actual, estableciendo un diálogo intercultural que pone en valor la herencia indígena y campesina. Posteriormente, se detalla el ciclo técnico y biológico de la planta, visibilizando los retos ambientales y productivos del oficio. Finalmente, la obra trasciende el formato tradicional para consolidarse como un instrumento pedagógico e interactivo que fomenta la apropiación social del conocimiento. A través de este material, se promueve el encuentro intergeneracional, el emprendimiento y la innovación técnica, ofreciendo a jóvenes, artesanos y a la comunidad en general, nuevas formas de habitar, comprender y potenciar su territorio.',

  prologo: {
    titulo: 'Prólogo de la Alcaldía de Aratoca',
    parrafos: [
      'Desde la Alcaldía Municipal de Aratoca, nos es grato presentar esta segunda versión ampliada y enriquecida de «Trenzando Saberes». Esta obra constituye un pilar fundamental dentro de nuestro plan de salvaguarda de la identidad campesina y reactivación económica popular fiquera, coordinada mediante la Convocatoria de Proyectos Productivos 2026.',
      'El fique ha sido, es y será el alma de nuestras colinas de Aratoca. Nuestro municipio, conocido con orgullo como la «Ciudad de las Colinas», ha llevado esta tradición a escenarios globales, destacando su proyección internacional en Europa mediante el Convenio de Cooperación Pontcharra (Colombia-Francia), demostrando que el arte del fique trasciende fronteras territoriales.',
      'Esta guía digital e interactiva busca inspirar tanto a la juventud local en las escuelas talleres como a los visitantes extranjeros que deseen comprender el milagro de esta fibra natural biodegradable. Invitamos a toda la comunidad a tejer juntos este porvenir sostenible.',
    ],
    callouts: [
      {
        tipo: 'sabias',
        titulo: 'Aratoca, Ciudad de las Colinas',
        texto:
          'Nuestro municipio es conocido como la «Ciudad de las Colinas». El Parque Principal, ubicado en la Calle 4 N.º 4-38, es el epicentro donde los artesanos locales se reúnen para compartir sus creaciones tejidas en fique, recibiendo el apoyo de las políticas culturales de la Alcaldía para asegurar que este patrimonio continúe floreciendo de cara al futuro.',
      },
    ],
  },

  partes: {
    1: { titulo: 'Raíces y Territorio', subtitulo: 'Historia y Contexto General del Fique' },
    2: { titulo: 'De la Tierra al Telar', subtitulo: 'El Proceso de Transformación' },
    3: { titulo: 'Horizontes Tejidos', subtitulo: 'Conclusiones y Ecosistema Digital' },
  },

  capitulos: {
    1: {
      titulo: 'El legado del pueblo Guane y la herencia prehispánica',
      parrafos: [
        'El tejido con fibras naturales ha sido un pilar fundamental en la cultura y el sustento de las comunidades que habitan el actual territorio colombiano desde épocas prehispánicas. En el cañón y el sureste de Santander, así como en zonas de Cundinamarca y Boyacá, el pueblo Guane destacó por su profunda conexión con la tierra y sus notables habilidades manuales. Esta cultura, dedicada principalmente a la caza y la agricultura, desarrolló una sofisticada expresión plástica a través de la cerámica y la confección textil. El fique, extraído de las pencas silvestres, tenía un carácter utilitario de suma importancia.',
        'Mientras el algodón era reservado para mantas finas y prendas de abrigo bellamente decoradas en ceremonias y trueques, la fibra del fique era el material predilecto para la elaboración de indumentaria utilitaria, como tocados, bolsas, mochilas, redes de pesca, cuerdas de amarre y calzado de uso diario, cuyos diseños guardan una asombrosa similitud con las piezas que los artesanos contemporáneos siguen produciendo en los talleres de Aratoca.',
        'Dado que los vestigios físicos de la cultura Guane son escasos debido a las condiciones de humedad del suelo, las piezas textiles que han logrado conservarse en cuevas secas poseen un valor antropológico incalculable, pues son el testimonio vivo de una destreza técnica milenaria que hoy renace bajo la marca comunitaria «Aratoca en Hilos».',
      ],
      callouts: [
        {
          tipo: 'sabias',
          titulo: 'Maestros originarios de la penca',
          texto:
            'Los Guanes fueron los primeros en decodificar los ciclos de crecimiento de la penca silvestre de fique. Con un conocimiento sagrado y respetuoso de la tierra, sabían exactamente en qué fases lunares cortar las hojas para extraer las fibras más largas, flexibles y resistentes, un saber que de manera informal aún influye en algunas familias campesinas.',
        },
      ],
    },
    2: {
      titulo: 'Panorama socioeconómico: La economía popular fiquera',
      parrafos: [
        'La historia de Aratoca, Santander, está profundamente ligada al cultivo, procesamiento y tejido ancestral de la fibra de fique. Esta tradición, heredada de la cultura indígena Guane, se convirtió durante décadas en el motor económico y la principal fuente de empleo de miles de familias campesinas de la región. A principios del siglo XX, esta labor se industrializó y tomó gran fuerza gracias al «boom» de la industria cafetera colombiana. La producción masiva de sacos o costales de fique se volvió vital para almacenar y transportar el café, papa y otros productos agrícolas tanto en Santander como en Boyacá, Cundinamarca y el mercado de exportación nacional.',
        'En Aratoca, gran parte de la población campesina aprendía a hilar y tejer el fique desde la infancia, transmitiendo este conocimiento de generación en generación de forma oral en el seno familiar. El municipio llegó a ser reconocido como uno de los grandes centros productores de estos empaques en el departamento de Santander. No obstante, a partir de la década de los 80, la producción tradicional de costales de fique comenzó a disminuir paulatinamente al ser reemplazada por fibras sintéticas de bajo costo derivadas del petróleo (polipropileno). Esto desató una crisis socioeconómica en el campo fiquero.',
        'Este cambio obligó al sector a reinventarse. Ante el desafío, los artesanos y asociaciones locales, con el apoyo de entidades nacionales como Artesanías de Colombia, promovieron capacitaciones para transformar el oficio. Así, el fique dejó de ser exclusivo para empaques agrícolas y evolucionó hacia productos de alto valor agregado, sostenibles y de diseño contemporáneo, como tapices decorativos, bolsos estilizados, manteles, calzado tradicional (alpargatas) y otros artículos utilitarios.',
        'En la actualidad, el ecosistema fiquero sigue estando sostenido por comunidades de gran resiliencia en Santander (destacando municipios como Mogotes, San Joaquín, Curití, Aratoca y Onzaga). Las cifras nacionales reportan más de 18.000 hectáreas sembradas, cultivadas casi en su totalidad (95%) por familias de estratos socioeconómicos vulnerables y de ascendencia indígena o campesina. A pesar de la riqueza cultural del oficio, el sector se enfrenta a dinámicas complejas: una alta dependencia de intermediarios comerciales, bajos niveles de formalización laboral en los talleres familiares y la necesidad imperante de diversificar la producción hacia artesanías sostenibles de alto valor agregado.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'La evolución del oficio',
          texto:
            'Para los nuevos estudiantes, la clave de la rentabilidad actual reside en la transición del «costal ralo» (empaque rústico tradicional) hacia tejidos finos y compactos que puedan combinarse con otros materiales nobles como el cuero o el mimbre. Esta diversificación aumenta el valor del producto final hasta en un 400%.',
        },
      ],
    },
    3: {
      titulo: 'La Furcraea: Botánica y ciclo de vida',
      parrafos: [
        'El fique es una planta imponente y escultural, originaria de la cordillera de los Andes de Colombia y clasificada científicamente dentro del género Furcraea sp., del cual existen cerca de veinte especies en la región. Su fisonomía se caracteriza por un tallo erguido del que brotan hojas largas, carnosas, con espinas laterales y de un verde intenso, coronadas en su madurez por flores de un tono blanco verdoso en un tallo floral gigante que brota del centro. Su adaptabilidad a suelos áridos y empinados del cañón hace del fique un protector natural contra la erosión de la tierra de Santander.',
        'En su etapa de madurez biológica, que suele alcanzarse entre los 5 y los 10 años dependiendo de las condiciones del suelo y la altitud, la planta produce una inflorescencia espectacular: un gran poste vertical o «escapo» que puede llegar a medir hasta 8 metros de altura, coronado por hermosas flores de un tono blanco verdoso que atraen a polinizadores locales. Tras la floración, la planta genera pequeños bulbillos que caerán al suelo para dar origen a nuevos brotes, completando así un ciclo de vida noble y generoso con el ecosistema andino.',
        'La extracción de la fibra respeta rigurosamente el ciclo biológico y la integridad de la planta: los cultivadores cortan únicamente las hojas maduras exteriores más cercanas a la base utilizando machetes tradicionales. Dejan un mínimo indispensable de quince a veinte pencas internas en el cogollo (corazón de la planta) para garantizar la fotosíntesis, supervivencia, crecimiento continuo y regeneración de la mata. Este método de corte manual selectivo permite cosechar la misma planta de fique durante un ciclo productivo que puede durar de 15 a 20 años.',
      ],
      callouts: [
        {
          tipo: 'sabias',
          titulo: 'La nobleza de la Furcraea',
          texto:
            'A diferencia de otros cultivos que requieren pesticidas pesados e irrigación constante, la planta de fique es extremadamente resistente a las sequías y actúa como un excelente protector y retenedor de suelos en laderas propensas a la erosión en Aratoca, convirtiéndola en un aliado clave contra el cambio climático.',
        },
      ],
    },
    4: {
      titulo: 'Extracción y rendimiento: El reto ambiental del bagazo',
      parrafos: [
        'Una vez recolectadas las hojas, inicia el proceso de desfibrado, el cual presenta uno de los mayores desafíos técnicos, económicos y ambientales para el sector artesanal y campesino. Durante el desfibrado tradicional, únicamente se logra aprovechar alrededor del 4% del peso total de la hoja verde como fibra de fique útil (cabuya limpia). El 96% restante del volumen se convierte en biomasa húmeda residual, conocida coloquialmente como «bagazo» (jugos ácidos y pulpa verde machacada).',
        'Tradicionalmente, este subproducto rico en saponinas y compuestos orgánicos ha sido desechado sin control. Debido a que el lavado tradicional de la fibra se realiza a orillas de fuentes hídricas, estos jugos ácidos suelen verterse directamente en los riachuelos y nacimientos de agua de Aratoca, alterando el pH del agua y generando un severo impacto ambiental en la microcuenca.',
        'Sin embargo, investigaciones recientes apoyadas por universidades y proyectos productivos de la Alcaldía apuntan a que este material residual alberga un enorme potencial para la creación de insecticidas ecológicos, abonos orgánicos fermentados, biomantos para control de erosión y papel artesanal de celulosa. Esto abre el camino para una bioeconomía circular sumamente lucrativa para los fiqueros.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'Abono orgánico de fique',
          texto:
            'El bagazo mezclado con estiércol de corral y cal apagada produce un compostaje de alta calidad en un período de solo 45 días. Este compost es ideal para nutrir el propio suelo fiquero, cerrando un ciclo totalmente orgánico y libre de químicos en la finca.',
        },
      ],
    },
    5: {
      titulo: 'El oficio artesanal: Los 7 pasos a la eternidad',
      parrafos: [
        'En el taller de Aratoca en Hilos, la memoria colectiva y la técnica artesanal se mantienen vivas gracias al ritual ancestral de transformación de la fibra. Este proceso, que exige maestría física y paciencia, se divide en siete pasos tradicionales.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'El secreto de un buen lavado',
          texto:
            'Si el lavado no se prolonga por el tiempo adecuado, la fibra conservará azúcares naturales que atraerán insectos o generarán moho en climas húmedos. Asegúrate de cumplir estrictamente con las 12 a 15 horas de remojo en agua limpia antes del secado.',
        },
      ],
    },
    6: {
      titulo: 'Innovación, Sostenibilidad y Co-Creación Artística',
      parrafos: [
        'Hoy en día, el trabajo en fique ha dejado de ser exclusivo para los tradicionales costales rústicos de café. Aratoca ha liderado un proceso de sofisticación artística mediante la co-creación con diseñadores de moda y arquitectos contemporáneos de renombre nacional. Gracias al apoyo del Ministerio de las Culturas, las Artes y los Saberes a través del Programa Nacional de Concertación Cultural 2026, los talleres familiares han aprendido a mezclar la cabuya con materiales nobles locales como cuero, mimbre, madera tallada y textiles de algodón reciclado.',
        'Esta hibridación técnica ha dado origen a la colección de alto diseño de «Aratoca en Hilos», la cual incluye mochilas exclusivas de alta costura, calzado ergonómico de exportación con suelas de fique, tapetes y lienzos decorativos con patrones abstractos y modernos, y mobiliario ligero para diseño de interiores. Además, se destaca la sostenibilidad al tratarse de una fibra 100% biodegradable que mitiga de manera directa la huella de carbono de los plásticos de un solo uso.',
        'El fortalecimiento y la supervivencia del tejido productivo en municipios de profunda tradición fiquera, como lo es Aratoca, requiere de una mirada integral que fusione de manera respetuosa la herencia histórica con la urgencia de la innovación técnica y ambiental. Para asegurar el futuro del sector, resulta indispensable superar las tecnologías tradicionales de bajo rendimiento y mitigar los impactos ecológicos asociados al procesamiento primitivo de la hoja, especialmente en lo que respecta al tratamiento de vertimientos hídricos.',
        'Al mismo tiempo, la organización comunitaria y la asociatividad deben apuntar con firmeza a la dignificación del trabajo artesanal, rompiendo la histórica dependencia de intermediarios comerciales y fomentando la creación de valor agregado local. El fique ya no debe considerarse únicamente una materia prima barata para empaques agrícolas; es un vehículo potente de identidad comunitaria, diseño ecológico y economía circular que, al complementarse con estrategias sólidas de emprendimiento y nuevas perspectivas estéticas contemporáneas, puede generar alternativas de ingresos reales, dignas y altamente sostenibles para los habitantes de la región.',
      ],
      callouts: [
        {
          tipo: 'sabias',
          titulo: 'Un vínculo con el mundo',
          texto:
            'El arte del fique de Aratoca ha trascendido fronteras. Gracias al Convenio de Cooperación con Pontcharra (Francia), las mochilas y tapices santandereanos se han exhibido en galerías de arte europeas, validando que la tradición combinada con la innovación tiene un mercado global esperando por ella.',
        },
      ],
    },
    7: {
      titulo: 'Ruta de Aprendizaje Interactivo: Guía del Curso Digital',
      parrafos: [
        'El fortalecimiento del sector fiquero en la «Ciudad de las Colinas» se materializa a través del «Taller de Oficios del Fique: Creatividad, Tradición y Emprendimiento en Aratoca». Este espacio de formación no formal de siete módulos promueve el intercambio intergeneracional entre maestros mayores y jóvenes emprendedores locales.',
      ],
      callouts: [
        {
          tipo: 'consejo',
          titulo: 'La dinámica de co-creación',
          texto:
            'La clave del éxito del módulo intergeneracional es emparejar a un artesano mayor (con maestría de teñido) con un joven estudiante (con facilidad en redes sociales). Ambos logran crear un producto único y su catálogo digital en tiempo récord.',
        },
      ],
    },
  },

  datosClave: {
    titulo: 'Datos clave del panorama socioeconómico nacional',
    items: [
      'Hectáreas cultivadas de fique en Colombia: más de 18.000 hectáreas en zonas rurales.',
      'Porcentaje de pequeños productores familiares: 95% del total nacional.',
      'Principales provincias en Santander: Guanentá y Comunera (Aratoca, Curití, Mogotes, Onzaga).',
      'Impacto de la transición sintética: caída del costal tradicional a partir de 1980.',
      'Organizaciones clave de apoyo regional: Coohilados del Fonce y Ecofibras.',
    ],
  },

  pasos: {
    titulo: 'Los 7 pasos a la eternidad',
    intro:
      'Este proceso, que exige maestría física y paciencia, se divide en los siguientes siete pasos tradicionales.',
    items: [
      {
        numero: 1,
        titulo: 'Cosecha selectiva',
        texto:
          'Se eligen con cuidado únicamente las hojas maduras de la base de la Furcraea sp., clasificándolas por longitud y grosor, asegurando la supervivencia del cogollo central para próximas cosechas.',
      },
      {
        numero: 2,
        titulo: 'Desfibrado (Extracción)',
        texto:
          'Las hojas se raspan para separar la fibra de la pulpa. Se realiza mediante «varillado» manual (un laborioso raspado artesanal contra un poste de madera) o con «maquinado» (desfibradoras de tambor accionadas por motor).',
      },
      {
        numero: 3,
        titulo: 'Lavado en fuentes puras',
        texto:
          'La cabuya extraída se sumerge en agua limpia durante 12 a 15 horas para retirar los jugos ácidos y la baba pegajosa de la planta, lavando con esmero cada manojo de forma manual.',
      },
      {
        numero: 4,
        titulo: 'Secado al sol de Aratoca',
        texto:
          'Las fibras se extienden al sol sobre cuerdas de alambre o en lomas ventiladas. Las hebras adquieren bajo el sol de Santander un tono beige claro o crema natural muy valorado en el mercado artesanal.',
      },
      {
        numero: 5,
        titulo: 'Escarmenado y peinado',
        texto:
          'Un cepillado vigoroso de los manojos secos a través de un cepillo rústico de clavos metálicos (peine). Esto desenreda, elimina asperezas, separa las fibras y suaviza el fique, preparándolo para el huso.',
      },
      {
        numero: 6,
        titulo: 'Hilado tradicional',
        texto:
          'Los artesanos tuercen las fibras finas usando tornos manuales o de pedal, regulando el grosor y la tensión para crear madejas de hilos de fique consistentes y suaves al tacto. Se tiñen con pigmentos locales y hojas.',
      },
      {
        numero: 7,
        titulo: 'Tejido en telar horizontal',
        texto:
          'En los telares de madera rústicos o ganchillos, los hilos de colores se cruzan con gran precisión. Esto da origen a finos lienzos de cabuya, tapices artísticos, calzado tradicional (alpargatas de fique) y mochilas decorativas.',
      },
    ],
  },

  sesion: {
    titulo: 'La sesión tipo de 3 horas',
    intro:
      'Las sesiones presenciales se estructuran bajo una rigurosa metodología práctica en formato de tres horas.',
    items: [
      {
        titulo: 'Bienvenida y energizador',
        duracion: '10–15 min',
        texto:
          'Breve juego de integración colectiva presencial para romper el hielo y preparar físicamente a los participantes.',
      },
      {
        titulo: 'Demostración técnica',
        duracion: '20–30 min',
        texto:
          'El maestro artesano realiza una demostración práctica directa del paso del fique del día (ej. hilado o teñido).',
      },
      {
        titulo: 'Trabajo práctico guiado',
        duracion: '90 min',
        texto:
          'Práctica directa de los estudiantes en parejas, con mentoría individualizada y directa de los artesanos mayores.',
      },
      {
        titulo: 'Puesta en común y feedback',
        duracion: '20–25 min',
        texto:
          'Los participantes exponen colectivamente sus avances, identificando errores comunes en el nudo y soluciones técnicas.',
      },
      {
        titulo: 'Tareas y micro-retos',
        duracion: '10 min',
        texto:
          'Asignación de un pequeño ejercicio práctico para realizar en casa o en el taller familiar antes de la siguiente sesión.',
      },
      {
        titulo: 'Registro y cierre',
        duracion: '5 min',
        texto:
          'Toma de fotografías técnicas de los avances de los prototipos, notas grupales y asistencia para la Alcaldía de Aratoca.',
      },
    ],
  },

  modulos: {
    titulo: 'El plan de estudios: siete módulos',
    intro:
      'El corazón de este programa académico no formal se asienta en el «Taller de Oficios del Fique: creatividad, tradición y emprendimiento en Aratoca». El taller consta de un plan de estudios dividido en siete módulos temáticos.',
    items: [
      {
        titulo: 'Introducción al patrimonio del fique',
        texto:
          'Historia de la fibra en Santander y Aratoca, su profundo significado cultural y valor ambiental.',
      },
      {
        titulo: 'Técnicas tradicionales de transformación',
        texto:
          'Prácticas guiadas de desfibrado, hilado manual, tejido básico y teñido natural con pigmentos locales.',
      },
      {
        titulo: 'Diseño y creatividad aplicada',
        texto:
          'Creación de moodboards, exploración de patrones y diseño de productos contemporáneos de valor utilitario y decoración.',
      },
      {
        titulo: 'Marketing, branding y comercialización',
        texto:
          'Construcción de la marca del taller familiar, fotografía de producto con celular, gestión de WhatsApp Business y cálculo de precios justos.',
      },
      {
        titulo: 'Nuevas técnicas e innovación',
        texto:
          'Colaboración directa con diseñadores invitados y mezcla experimental de fique con materiales nobles: mimbre, cuero y telas recicladas.',
      },
      {
        titulo: 'Diálogo intergeneracional y construcción comunitaria',
        texto:
          'Sesiones donde los tejedores ancianos comparten relatos tradicionales y los jóvenes aportan sus habilidades tecnológicas.',
      },
      {
        titulo: 'Producción final y feria de cierre',
        texto:
          'Creación de una línea de objetos exclusivos y preparación para la venta y exhibición en la feria local impulsada por la Alcaldía Municipal.',
      },
    ],
  },

  modulosWeb: {
    titulo: 'Módulos de la plataforma digital',
    intro:
      'Como extensión interactiva de esta obra digital, la plataforma web de «Aratoca en Hilos» asume los siguientes tres módulos de aprendizaje, diseñados para garantizar la apropiación social del conocimiento.',
    items: [
      {
        titulo: 'Módulo de Innovación y Diseño (Pedagogía Creativa)',
        texto:
          'Un aula interactiva que inspira a los tejedores a trascender el tradicional costal de fique hacia accesorios contemporáneos de moda y decoración de interiores, colaborando con diseñadores invitados.',
      },
      {
        titulo: 'Módulo de Sostenibilidad y Bioeconomía (Cuidado de la Tierra)',
        texto:
          'Videotutoriales prácticos sobre cómo fermentar el 96% de bagazo residual de fique para abonos orgánicos, evitando verter los ácidos fiqueros en las fuentes hídricas de Aratoca.',
      },
      {
        titulo: 'Módulo de Emprendimiento y WhatsApp Business',
        texto:
          'Capacitación digital de Aratoca en Hilos sobre fotografía con celular para catálogo, fijación de precios y ventas directas comunitarias, minimizando intermediarios comerciales.',
      },
    ],
  },

  assets: {
    TAG_01_HERO_PANORAMA: {
      titulo: 'Gran panorama del Cañón del Chicamocha y cultivos de fique en Aratoca',
      alt: 'Vista aérea del Cañón del Chicamocha con las colinas de Aratoca en tonos terracota y terrazas agrícolas de fique bajo un sol radiante.',
      pie: 'El Cañón del Chicamocha y las terrazas de fique que dan a Aratoca su nombre de «Ciudad de las Colinas».',
    },
    TAG_02_GUANE_MUSEUM: {
      titulo: 'Vestigios textiles Guanes: hilados de fique milenarios',
      alt: 'Fragmentos de tejidos Guanes conservados: redes trenzadas de fique, nudos primitivos y patrones geométricos teñidos con ocres minerales.',
      pie: 'Fragmentos Guanes conservados en colecciones antropológicas: nudos y tramas casi idénticos a los que hoy se tejen en Aratoca.',
    },
    TAG_03_PORTRAIT_ELDER: {
      titulo: 'Retrato de Doña María, maestra hiladora de Aratoca',
      alt: 'Artesana mayor de Aratoca sonriendo mientras sostiene un huso tradicional con hilos de fique recién hilados; sus manos y el hilo dorado en primer plano.',
      pie: 'Doña María, maestra hiladora. Aprendió el oficio a los seis años en la vereda.',
    },
    TAG_04_LANDSCAPE_FIQUE: {
      titulo: 'La anatomía del fique: penca y cogollo de Furcraea',
      alt: 'Planta madura de Furcraea con hojas verde esmeralda y espinas rojizas, el cogollo central intacto y cortes limpios en las hojas basales.',
      pie: 'Una mata madura de Furcraea: el cogollo central intacto y los cortes limpios que permiten cosechar la misma planta durante quince o veinte años.',
    },
    TAG_05_TRADITIONAL_DESFIBRADO: {
      titulo: 'Desfibrado mecánico y el flujo del bagazo residual',
      alt: 'Operario alimentando hojas de fique en una desfibradora de tambor; la pulpa sale disparada por un conducto mientras la fibra larga emerge limpia y tensada.',
      pie: 'Por cada cien kilos de hoja verde, cuatro se convierten en cabuya limpia. Los otros noventa y seis son bagazo.',
    },
    TAG_06_FIBERS_DRYING: {
      titulo: 'Líneas de secado de fique al sol de Aratoca',
      alt: 'Miles de madejas de fique beige extendidas en tendederos de alambre que se cruzan en diagonal, contra un cielo azul profundo.',
      pie: 'El sol de Santander da a la fibra el tono crema que el mercado artesanal más valora.',
    },
    TAG_07_SPINNING_WHEEL: {
      titulo: 'El torno de hilado: manos en movimiento',
      alt: 'Detalle de un torno tradicional de madera girando, con las manos del artesano controlando la tensión de la fibra hacia el huso.',
      pie: 'El torno de pedal, donde la fibra escarmenada se convierte en hilo.',
    },
    TAG_08_LOOM_WEAVING: {
      titulo: 'La trama del telar horizontal en Aratoca en Hilos',
      alt: 'Vista cenital del peine de madera de un telar tradicional cruzando madejas de fique teñidas en terracota, verde oliva y café.',
      pie: 'El telar horizontal, de origen precolombino, sigue siendo la herramienta final del oficio.',
    },
    TAG_09_BAGAZO_INNOVATION: {
      titulo: 'Bio-abonos y productos derivados de la bioeconomía del fique',
      alt: 'Macetas biodegradables de pulpa prensada de fique, envases de papel artesanal y frascos de insecticida ecológico etiquetados en Aratoca.',
      pie: 'El bagazo que antes contaminaba las quebradas, convertido en macetas, abono y repelente natural.',
    },
    TAG_10_MODERN_PRODUCTS_FLATLAY: {
      titulo: 'Colección de alto diseño Aratoca en Hilos',
      alt: 'Bodegón cenital sobre madera clara con mochilas de fique teñidas con cortezas, individuales circulares, alpargatas con detalles en cuero y un cojín geométrico.',
      pie: 'La colección contemporánea: la misma fibra, cuatrocientos años después del costal.',
    },
    TAG_11_TALLER_SESSION: {
      titulo: 'El encuentro de generaciones: taller de fique en Aratoca',
      alt: 'Artesano mayor guiando pacientemente los dedos de un joven aprendiz que tensa la urdimbre de fique en un pequeño telar de marco.',
      pie: 'El módulo intergeneracional: el maestro aporta la técnica, el aprendiz aporta el alcance digital.',
    },
    TAG_12_APP_UX_MOCKUP: {
      titulo: 'La aplicación del libro interactivo',
      alt: 'Tableta sobre una mesa de madera rústica junto a hilos de fique de colores, mostrando la interfaz del libro con una infografía, un reproductor de audio y un mapa.',
      pie: 'El libro interactivo, pensado para leerse igual en una escuela de Aratoca que al otro lado del mundo.',
    },
    TAG_13_ALCALDIA_DELIVERY: {
      titulo: 'Entrega oficial del libro en el Parque Principal de Aratoca',
      alt: 'El alcalde municipal y representantes del comité fiquero junto a artesanos durante la entrega oficial del libro en el Parque Principal.',
      pie: 'Entrega oficial de la obra en el Parque Principal, Calle 4 N.º 4-38.',
    },
  },
};
