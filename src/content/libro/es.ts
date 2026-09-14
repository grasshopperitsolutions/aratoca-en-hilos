/**
 * "Trenzando Saberes" — Spanish, the language of record.
 *
 * Transcribed from the printed first edition (`Trenzando_Saberes_EDITABLE/index.html`,
 * Aratoca, 2026). Every sentence of prose is the Alcaldía's; the only editorial
 * liberties are structural, and they are the ones a screen needs and a page does
 * not: the half-title and inner title pages are dropped as redundant once there
 * is a cover, the printed index is replaced by the reader's own contents, and
 * the legal page's rights notice moves to the colophon.
 *
 * The activity wording — questions, options and explanations — is ours, written
 * from the client's text so that every answer is findable in the chapter it sits
 * in. It is pedagogy layered onto an institutional publication and the Alcaldía
 * should review it as they would the prose.
 */

import type { LibroTexto } from '../../types/libro';

export const LIBRO_ES: LibroTexto = {
  titulo: 'Trenzando Saberes',
  subtitulo: 'Historia, transformación y futuro del fique en Santander',
  editor: 'Alcaldía Municipal de Aratoca',
  lugar: 'Aratoca · Santander · Colombia',
  edicion: 'Primera edición · 2026',

  presentacion: {
    ordinal: 'Palabras de apertura',
    titulo: 'Presentación',
    firma: 'Alcalde Municipal de Aratoca',
    bloques: [
      {
        tipo: 'parrafo',
        capitular: true,
        texto:
          'Hay municipios que se reconocen en un río, en una montaña o en una fecha. Aratoca se reconoce en una fibra. Durante generaciones, el fique ha sido aquí mucho más que un cultivo: ha sido el oficio que sostuvo la casa, el hilo que unió a las familias en la enramada y el lenguaje con el que este territorio aprendió a nombrarse ante el resto de Santander.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Quienes crecimos viendo a nuestras madres y abuelas hilar en el corredor, y a nuestros padres bajar de la loma con el manojo de fibra al hombro, sabemos que ese conocimiento no está escrito en ningún manual. Se aprende mirando, se corrige con la mano encima y se transmite en voz baja mientras se trabaja. Es precisamente esa condición —oral, práctica, cotidiana— la que hoy lo pone en riesgo.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Este libro nace de una convicción sencilla: lo que no se documenta se olvida, y lo que se olvida deja de producir. Por eso la Alcaldía Municipal de Aratoca decidió reunir en un solo volumen la historia larga del fique en nuestro territorio, la descripción técnica de cada fase de su transformación y una lectura honesta de los desafíos que enfrenta el sector. No se trata de un homenaje nostálgico. Se trata de una herramienta de trabajo.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Las páginas que siguen recogen la herencia del pueblo Guane, el auge de los empaques agrícolas durante el siglo XX, la crisis que trajeron las fibras sintéticas y la reinvención que hoy adelantan nuestras familias artesanas hacia productos de mayor valor agregado. También abordan un asunto que ya no podemos aplazar: el aprovechamiento del bagazo y el cuidado de nuestras fuentes hídricas.',
      },
      {
        tipo: 'parrafo',
        texto:
          'Entregamos esta primera edición a los artesanos y artesanas de Aratoca, a los jóvenes que buscan en el territorio una alternativa de vida digna, a los docentes que quieran llevarlo al aula y a quienes nos visitan y desean entender qué hay detrás de una mochila, una alpargata o un tapete de cabuya.',
      },
      {
        tipo: 'cita',
        texto: 'Que este libro circule, se raye, se preste y se discuta. Ese será el mejor indicio de que cumplió su propósito.',
        fuente: 'Presentación',
      },
    ],
  },

  sinopsis: {
    ordinal: 'Nota editorial',
    titulo: 'Sobre esta obra',
    bloques: [
      {
        tipo: 'entradilla',
        texto:
          'Esta obra busca revitalizar y salvaguardar los conocimientos ancestrales y tradicionales asociados al cultivo y la transformación del fique, entendidos no solo como un oficio, sino como el núcleo de la economía popular y de la identidad cultural de las comunidades artesanas de Santander.',
      },
      {
        tipo: 'parrafo',
        capitular: true,
        texto:
          'El recorrido está organizado en tres movimientos. El primero traza la historia larga del fique, desde las prácticas originarias del pueblo Guane hasta el panorama socioeconómico contemporáneo, en un diálogo intercultural que pone en valor la herencia indígena y campesina. El segundo detalla el ciclo técnico y biológico de la planta, visibilizando los retos ambientales y productivos del oficio. El tercero recoge las conclusiones y proyecta las rutas de innovación que el sector necesita recorrer.',
      },
      {
        tipo: 'parrafo',
        texto:
          'El énfasis está puesto en el municipio de Aratoca, pero el relato es válido para toda la franja fiquera de las provincias de Guanentá y Comunera. Lo que aquí se cuenta ocurre, con matices, en Mogotes, San Joaquín, Curití y Onzaga.',
      },
      { tipo: 'subtitulo', texto: 'Cómo leer este libro' },
      {
        tipo: 'parrafo',
        texto:
          'El texto puede leerse de corrido, pero está pensado también para consultarse por partes. Los capítulos técnicos funcionan como fichas de trabajo: describen paso a paso lo que ocurre entre la penca cortada en la loma y el producto terminado en el telar.',
      },
      {
        tipo: 'caja',
        rotulo: 'Sobre las palabras',
        parrafos: [
          'A lo largo del libro se emplean los términos que usan los propios artesanos: penca, cabuya, varillado, escarmenado, cogollo, bagazo. Todos ellos están reunidos y explicados en el glosario que cierra la obra. Conservar el vocabulario del oficio es también una forma de conservar el oficio.',
        ],
      },
      { tipo: 'subtitulo', texto: 'Una advertencia necesaria' },
      {
        tipo: 'parrafo',
        texto:
          'Este no es un inventario cerrado. La documentación de un saber vivo nunca termina: cada vereda guarda variantes de la técnica que no alcanzan a caber en un primer volumen. Esta edición se entrega como punto de partida y como invitación abierta a continuarla.',
      },
    ],
  },

  partes: {
    1: {
      titulo: 'Raíces y territorio',
      subtitulo:
        'Historia y contexto general del fique: del pueblo Guane a la economía popular contemporánea.',
      foto: 'cultivo_fique',
    },
    2: {
      titulo: 'De la tierra al telar',
      subtitulo:
        'El proceso de transformación del fique: botánica, extracción, rendimiento y oficio artesanal.',
      foto: 'penga_fique_cortada',
    },
    3: {
      titulo: 'Horizontes tejidos',
      subtitulo:
        'Conclusiones: hacia la innovación, la sostenibilidad y la dignificación del trabajo artesanal.',
      foto: 'tejedor_trabajando_fique',
    },
  },

  laminas: {
    territorio: {
      foto: 'vista_panoramica_aratoca',
      titulo: 'El territorio',
      pie: 'Aratoca, Santander. El casco urbano se acomoda sobre la ladera, entre el filo de la montaña y el descenso hacia el cañón. Esta geografía quebrada define tanto la vida cotidiana del municipio como la manera en que se siembra y se cosecha el fique.',
    },
    centro: {
      foto: 'toma_iglesia_aratoca',
      titulo: 'El centro del municipio',
      pie: 'La iglesia parroquial y la plaza principal de Aratoca. Alrededor de este núcleo se organizó, durante décadas, el comercio de la fibra: aquí llegaban los manojos de cabuya de las veredas y desde aquí salían los costales hacia Boyacá y Cundinamarca.',
    },
    lavado: {
      foto: 'lavado_artesanal',
      titulo: 'Lavado artesanal',
      pie: 'Tras el desfibrado, la cabuya se enjuaga y se escurre para retirar los residuos de pulpa. Es la fase que define el color y el brillo de la fibra, y también la que concentra el mayor impacto sobre las fuentes de agua de la vereda.',
    },
    desfibradora: {
      foto: 'hombre_trabajando_fique',
      titulo: 'Desfibrado maquinado',
      pie: 'La desfibradora mecánica multiplica el rendimiento por jornada frente al varillado manual, pero exige inversión, mantenimiento y un punto de trabajo fijo. Entre las dos técnicas —la vara y la máquina— se juega hoy buena parte del futuro productivo del sector.',
    },
  },

  capitulos: {
    /* ---------------------------------------------------------------- */
    1: {
      ordinal: 'Capítulo uno',
      titulo: 'El legado del pueblo Guane y la herencia prehispánica',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'El tejido con fibras naturales ha sido un pilar fundamental en la cultura y el sustento de las comunidades que habitan el actual territorio colombiano desde épocas prehispánicas.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'En el sureste de Santander, así como en zonas de Cundinamarca y Boyacá, el pueblo Guane se destacó por su profunda conexión con la tierra y por sus notables habilidades manuales. Esta cultura, dedicada principalmente a la caza y a la agricultura, desarrolló una sofisticada expresión plástica a través de la cerámica y de la confección textil.',
        },
        {
          tipo: 'parrafo',
          texto:
            'La distinción entre materiales revela una comprensión precisa de las propiedades de cada fibra. Mientras el algodón se reservaba para mantas finas y prendas de abrigo bellamente decoradas, la fibra del fique era el material predilecto para la elaboración de indumentaria utilitaria: tocados, bolsas y mochilas. No se trataba de una jerarquía de prestigio, sino de una asignación funcional. El algodón abrigaba; el fique cargaba, resistía y duraba.',
        },
        { tipo: 'actividad', id: 'c1-algodon-o-fique' },
        {
          tipo: 'parrafo',
          texto:
            'Esa decisión técnica tomada hace siglos sigue vigente. Los diseños de aquellas piezas guardan una asombrosa similitud con las que los artesanos contemporáneos continúan produciendo en Aratoca y en los municipios vecinos. La forma de la mochila, la lógica del trenzado, la manera de rematar un borde: son gestos que atravesaron la Colonia, la República y la industrialización sin perder su estructura esencial.',
        },
        { tipo: 'subtitulo', texto: 'Un testimonio escaso y por eso invaluable' },
        {
          tipo: 'parrafo',
          texto:
            'Dado que los vestigios físicos de la cultura Guane son escasos, las piezas textiles que han logrado conservarse poseen un valor antropológico incalculable. Las fibras vegetales son, por naturaleza, materiales perecederos: se degradan con la humedad, el calor y el tiempo. Que algunas hayan sobrevivido las convierte en testimonio vivo de una destreza técnica milenaria.',
        },
        { tipo: 'actividad', id: 'c1-vestigios' },
        {
          tipo: 'parrafo',
          texto:
            'Este dato tiene una consecuencia directa sobre el presente. Cada artesano que hoy hila y teje fique en Aratoca no está simplemente ejerciendo un oficio: está sosteniendo la única versión funcional que queda de ese conocimiento.',
        },
        {
          tipo: 'cita',
          texto: 'Los museos conservan los objetos. Las manos conservan el método.',
          fuente: 'Sobre la transmisión del saber fiquero',
        },
        { tipo: 'subtitulo', texto: 'Del territorio Guane al municipio de Aratoca' },
        {
          tipo: 'parrafo',
          texto:
            'La historia de Aratoca está profundamente ligada al cultivo, procesamiento y tejido ancestral de la fibra de fique. Esta tradición, heredada de la cultura indígena Guane, se convirtió durante décadas en el motor económico y en la principal fuente de empleo de miles de familias campesinas de la región.',
        },
        {
          tipo: 'parrafo',
          texto:
            'La continuidad no fue accidental. El fique prospera en suelos pobres, pendientes y de baja retención de humedad —exactamente las condiciones que caracterizan buena parte del territorio aratoqueño—. Donde otros cultivos exigen riego, planicie o fertilización constante, el fique se instala y persiste. Esa compatibilidad entre planta y paisaje explica por qué el oficio echó raíces aquí con tanta fuerza y por qué logró sostenerse durante generaciones.',
        },
        {
          tipo: 'parrafo',
          texto:
            'A ello se sumó una segunda condición, esta de orden social: el conocimiento se distribuyó ampliamente. En Aratoca, gran parte de la población campesina aprendía a hilar y a tejer el fique desde la infancia, transmitiendo este conocimiento de generación en generación. No existía un gremio cerrado ni un taller especializado que monopolizara la técnica. El saber estaba en las casas.',
        },
        { tipo: 'actividad', id: 'c1-gremio' },
        {
          tipo: 'foto',
          foto: 'planta_y_montana',
          titulo: 'Vereda de Aratoca',
          pie: 'El fique crece en los bordes de camino y en las laderas de mayor pendiente, ocupando terrenos que difícilmente admitirían otro cultivo. Su presencia marca el límite entre lo sembrado y el monte.',
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    2: {
      ordinal: 'Capítulo dos',
      titulo: 'Panorama socioeconómico: la economía popular fiquera',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'El ecosistema fiquero sigue estando sostenido por comunidades de gran resiliencia. La producción de la cabuya es el motor de una economía popular y campesina que resistió la sustitución industrial y hoy se reinventa.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'La producción nacional de cabuya se concentra en departamentos como Santander, Nariño, Antioquia, Caldas y Boyacá. Las cifras nacionales han llegado a reportar más de dieciocho mil hectáreas sembradas, cultivadas casi en su totalidad —cerca del noventa y cinco por ciento— por familias de estratos vulnerables y de ascendencia indígena o campesina.',
        },
        { tipo: 'actividad', id: 'c2-porcentaje-familias' },
        {
          tipo: 'datos',
          items: [
            { cifra: '18.000', leyenda: 'Hectáreas sembradas reportadas a nivel nacional' },
            { cifra: '95%', leyenda: 'Cultivadas por familias campesinas e indígenas' },
            { cifra: '5', leyenda: 'Departamentos concentran la producción' },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'Ese dato define el carácter del sector. El fique no es un cultivo de agroindustria: es un cultivo de economía familiar, organizado no alrededor de grandes plantaciones sino de miles de unidades pequeñas, dispersas en zonas de ladera, donde la mano de obra es la de la propia familia.',
        },
        { tipo: 'subtitulo', texto: 'Santander: las provincias fiqueras' },
        {
          tipo: 'parrafo',
          texto:
            'En Santander, el fique es un cultivo ancestral y sostenible, fundamental en la economía del departamento. Se concentra en las provincias de Guanentá y Comunera —Mogotes, San Joaquín, Curití, Aratoca y Onzaga—, donde representa el sustento de miles de familias campesinas y artesanas.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Esta concentración territorial produce vecindad técnica: los municipios comparten variedades, herramientas, vocabulario y compradores. Esa red informal de aprendizaje es uno de los activos menos reconocidos del sector.',
        },
        { tipo: 'subtitulo', texto: 'El origen y la época de oro en Aratoca' },
        {
          tipo: 'lineaTiempo',
          hitos: [
            {
              anio: 1900,
              titulo: 'El trabajo manual',
              texto:
                'Los habitantes de la zona cultivaban la planta de fique y procesaban sus largas hojas de manera manual para extraer la fibra.',
            },
            {
              anio: 1920,
              titulo: 'El auge cafetero',
              texto:
                'A principios del siglo XX la labor se industrializó y tomó gran fuerza gracias al auge de la industria cafetera. El café requería empaque: sacos resistentes, transpirables, capaces de soportar el cargue, el arriero, la bodega y el viaje.',
            },
            {
              anio: 1950,
              titulo: 'La época de oro',
              texto:
                'Aratoca llegó a ser reconocido como uno de los grandes centros productores de empaques del departamento. El fique no fue una actividad complementaria sino la principal de buena parte de la población rural: el calendario familiar —el corte, el desfibrado, el lavado, el secado, el hilado— organizaba la semana.',
            },
            {
              anio: 1980,
              titulo: 'La sustitución sintética',
              texto:
                'La producción tradicional de costales comenzó a disminuir al ser reemplazada por fibras sintéticas. El polipropileno resultaba más barato, más liviano y más fácil de producir en serie. En pocos años, el mercado que había sostenido a Aratoca durante medio siglo se contrajo.',
            },
            {
              anio: 2026,
              titulo: 'La reinvención',
              texto:
                'Artesanos, asociaciones y entidades como Artesanías de Colombia impulsaron capacitaciones para transformar la fibra y buscar nuevos destinos para el producto. El trabajo en fique dejó de ser exclusivo de los costales y evolucionó hacia productos de mayor valor agregado.',
            },
          ],
        },
        { tipo: 'subtitulo', texto: 'Lo que hoy se elabora' },
        {
          tipo: 'lista',
          items: [
            {
              titulo: 'Artesanías decorativas',
              texto: 'Piezas de exhibición, individuales, cestería y objetos de ambientación para el hogar.',
            },
            {
              titulo: 'Bolsos y mochilas',
              texto: 'El producto de mayor rotación comercial, con fuerte demanda entre visitantes y mercados urbanos.',
            },
            {
              titulo: 'Tapetes y manteles',
              texto: 'Piezas de mayor formato, que exigen telar y tiempos de trabajo prolongados.',
            },
            {
              titulo: 'Alpargatas y otros productos utilitarios',
              texto: 'Calzado tradicional cuya suela trenzada mantiene viva una técnica de alta especialización.',
            },
          ],
        },
        { tipo: 'subtitulo', texto: 'Las dinámicas que aún limitan al sector' },
        {
          tipo: 'parrafo',
          texto:
            'A pesar de la riqueza cultural del oficio, el sector se enfrenta a dinámicas complejas que conviene nombrar con precisión, porque de su diagnóstico depende cualquier política pública o proyecto de fortalecimiento: alta dependencia de intermediarios, que capturan el margen y desconectan al artesano del precio final de su pieza; bajos niveles de formalización laboral, en talleres predominantemente familiares, sin contrato ni registro contable de tiempos y costos; y la necesidad de diversificar el producto, porque la dependencia del costal ralo mantiene al sector atado a un mercado de bajo precio y alta competencia sintética.',
        },
        { tipo: 'actividad', id: 'c2-limitaciones' },
        {
          tipo: 'caja',
          rotulo: 'Innovación institucional en la provincia',
          parrafos: [
            'El fique no solo se procesa para hacer costales o empaques agrícolas: se ha transformado mediante innovación. Organizaciones locales como Coohilados del Fonce, en San Gil, y Ecofibras, en Curití, trabajan en la transformación de la fibra para la creación de artesanías, productos decorativos, suelas de alpargatas e incluso artículos de exportación.',
            'A ello se suma un atributo que el mercado contemporáneo valora cada vez más: se trata de una fibra cien por ciento biodegradable, producida en un cultivo de bajo requerimiento de insumos.',
          ],
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    3: {
      ordinal: 'Capítulo tres',
      titulo: 'La Furcraea: botánica y ciclo de vida',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'El fique es una planta imponente, originaria de Colombia y clasificada científicamente dentro del género Furcraea sp., del cual existen cerca de veinte especies.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'Su fisonomía se caracteriza por un tallo erguido del que brotan hojas largas, carnosas y de un verde intenso, coronadas en su madurez por flores de un tono blanco verdoso. La planta organiza su crecimiento en roseta: las hojas nuevas nacen desde el centro y empujan hacia afuera a las más antiguas, que van descendiendo y abriéndose hasta quedar casi horizontales.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Esa arquitectura es la que hace posible el aprovechamiento sostenido. La extracción de la fibra respeta el ciclo biológico de la planta: los cultivadores cortan las hojas más cercanas a la base —las más maduras, las de fibra más larga y resistente— dejando un mínimo de quince a veinte pencas en el cogollo para garantizar la supervivencia y la regeneración de la mata.',
        },
        { tipo: 'actividad', id: 'c3-cogollo' },
        {
          tipo: 'caja',
          rotulo: 'La regla del cogollo',
          parrafos: [
            'Dejar entre quince y veinte pencas en el cogollo no es una recomendación técnica externa: es un criterio construido por los propios cultivadores a partir de la observación acumulada. Cortar por debajo de ese umbral compromete la capacidad fotosintética de la planta, retrasa la producción de hojas nuevas y, en casos severos, la mata.',
            'Es, en la práctica, una norma de manejo sostenible transmitida oralmente durante generaciones, mucho antes de que existiera un vocabulario formal para nombrarla.',
          ],
        },
        { tipo: 'subtitulo', texto: 'El maguey: el final del ciclo' },
        {
          tipo: 'parrafo',
          texto:
            'Al término de su vida útil, la planta emite desde el centro un largo tallo floral que puede superar varias veces la altura de la roseta. En el lenguaje local, esa estructura y la planta que la produce se conocen como maguey. Su aparición anuncia el cierre del ciclo: la planta concentra sus reservas en la floración y, tras ella, muere.',
        },
        { tipo: 'actividad', id: 'c3-floracion' },
        {
          tipo: 'foto',
          foto: 'maguey',
          titulo: 'El mástil del maguey',
          pie: 'El tallo floral se levanta muy por encima del monte circundante y se vuelve visible desde grandes distancias. Los cultivadores lo leen como un reloj: marca qué plantas están cerrando su ciclo productivo.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Este desenlace obliga a pensar el cultivo en términos de relevo. Una plantación de fique no se sostiene por la longevidad de sus individuos, sino por la renovación escalonada: mientras unas matas producen, otras crecen y otras florecen. El productor que solo cosecha, sin sembrar reemplazos, condena su parcela a un vaciamiento progresivo.',
        },
        { tipo: 'subtitulo', texto: 'Condiciones de cultivo' },
        {
          tipo: 'parrafo',
          texto:
            'El fique se adapta a suelos de baja fertilidad y a terrenos de pendiente pronunciada donde la mecanización es imposible. Requiere poca agua, no exige riego permanente y tolera periodos secos prolongados. Estas características lo convirtieron históricamente en el cultivo de las tierras que ningún otro producto quería.',
        },
        { tipo: 'actividad', id: 'c3-riego' },
        {
          tipo: 'parrafo',
          texto:
            'Existe además un beneficio ambiental frecuentemente pasado por alto: por su sistema radicular y su disposición en las laderas, las plantaciones de fique contribuyen a la retención del suelo y a la contención de procesos erosivos en terrenos de alta pendiente, como los que caracterizan buena parte del territorio de Aratoca.',
        },
        { tipo: 'subtitulo', texto: 'De la hoja a la fibra' },
        {
          tipo: 'parrafo',
          texto:
            'Dentro de la penca, la fibra se organiza en haces longitudinales embebidos en un tejido carnoso y acuoso. Todo el proceso de transformación que se describe en el capítulo siguiente consiste, esencialmente, en una sola operación repetida con distintas herramientas: separar el haz de la pulpa sin romperlo. De la limpieza con que se logre esa separación dependen la longitud, el brillo, el color y la resistencia del hilo final. Ahí se decide, en buena medida, el valor comercial de la pieza terminada.',
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    4: {
      ordinal: 'Capítulo cuatro',
      titulo: 'Extracción y rendimiento: el reto ambiental del bagazo',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'Una vez recolectadas las hojas, inicia un proceso de transformación que presenta uno de los mayores desafíos técnicos y ambientales para el sector.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'Durante el desfibrado únicamente se logra aprovechar alrededor del cuatro por ciento del peso total de la hoja como fibra útil, es decir, como cabuya. El noventa y seis por ciento restante se convierte en biomasa residual, conocida coloquialmente como bagazo.',
        },
        { tipo: 'actividad', id: 'c4-rendimiento' },
        {
          tipo: 'datos',
          items: [
            { cifra: '4%', leyenda: 'De la hoja se aprovecha como fibra útil (cabuya)' },
            { cifra: '96%', leyenda: 'Se convierte en biomasa residual o bagazo' },
          ],
        },
        {
          tipo: 'parrafo',
          texto:
            'La magnitud de esa proporción es difícil de exagerar. Por cada arroba de fibra que sale de una parcela, quedan en el terreno y en el punto de lavado varias veces ese peso en material vegetal húmedo. Tradicionalmente, este subproducto ha sido desaprovechado.',
        },
        { tipo: 'subtitulo', texto: 'El impacto sobre las fuentes hídricas' },
        {
          tipo: 'parrafo',
          texto:
            'El problema no es solo de volumen sino de destino. Debido a las prácticas de lavado de la fibra, los jugos del bagazo suelen verterse en fuentes hídricas, generando impactos ambientales negativos sobre quebradas y nacimientos que, en zonas de ladera, abastecen a las mismas veredas donde se procesa la fibra.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Reconocer esto no es un señalamiento a las familias productoras. Es la constatación de un vacío técnico: durante décadas no existió alternativa disponible, económica y practicable para disponer de ese residuo. El agua era el único vehículo a la mano.',
        },
        { tipo: 'subtitulo', texto: 'Las fases del proceso de transformación' },
        {
          tipo: 'parrafo',
          texto:
            'El recorrido que va de la penca cortada al hilo terminado comprende seis fases claramente diferenciadas. Cada una tiene sus tiempos, sus herramientas y sus criterios de calidad.',
        },
        {
          tipo: 'fases',
          items: [
            {
              titulo: 'Cosecha',
              texto:
                'Se cortan las hojas maduras de la planta de fique y se realiza la clasificación según su calidad. Se privilegian las pencas de la base, de mayor longitud y madurez, respetando siempre el mínimo de quince a veinte hojas en el cogollo.',
            },
            {
              titulo: 'Extracción o desfibrado',
              texto:
                'Se separa la fibra de la masa carnosa de la hoja. El proceso puede realizarse por varillado —el método manual y tradicional, en el que la penca se raspa contra una vara fija hasta desprender la pulpa— o de manera maquinada, mediante desfibradoras mecánicas que aumentan el rendimiento por jornada.',
            },
            {
              titulo: 'Lavado y secado',
              texto:
                'Las fibras extraídas se sumergen en agua durante doce a quince horas, se lavan para retirar los residuos de pulpa y los jugos adheridos, y luego se extienden al sol para su secado. De esta fase depende directamente el color final de la cabuya: un lavado incompleto o un secado a la sombra oscurecen y manchan la fibra.',
            },
            {
              titulo: 'Escarmenado y peinado',
              texto:
                'Los manojos secos se pasan por un cepillo de clavos para desenredar, pulir y limpiar la fibra. La operación alinea los filamentos en una misma dirección y separa la fibra larga —la de mayor valor— de la corta y quebrada, que se destina a usos secundarios.',
            },
            {
              titulo: 'Hilado',
              texto:
                'Es el proceso en el que la fibra se tuerce para formar hilos. Del grosor y de la tensión del torcido dependen la resistencia y el destino de la cabuya: hilo fino para tejidos de detalle, hilo grueso para empaques y suelas. Si se desea, en esta fase se tiñe usando tinturas naturales o artificiales.',
            },
            {
              titulo: 'Acabado final',
              texto:
                'El hilo se teje en telares, ganchillos o máquinas para crear productos utilitarios como costales, bolsos, manteles, tapetes o papel artesanal. Es la fase donde se concentra el diseño y donde, en consecuencia, se genera la mayor proporción del valor agregado de la cadena.',
            },
          ],
        },
        { tipo: 'actividad', id: 'c4-remojo' },
        {
          tipo: 'caja',
          rotulo: 'Punto crítico del proceso',
          parrafos: [
            'El lavado es, simultáneamente, la fase que define la calidad comercial de la fibra y la que concentra el mayor impacto ambiental del oficio. Cualquier mejora técnica en este punto —recirculación del agua, sedimentadores, captura de jugos para compostaje— tiene un efecto doble: mejora el producto y protege la quebrada.',
          ],
        },
        { tipo: 'subtitulo', texto: 'El bagazo como oportunidad' },
        {
          tipo: 'parrafo',
          texto:
            'Investigaciones recientes apuntan a que el material residual del desfibrado alberga un enorme potencial para la creación de insecticidas naturales, abonos orgánicos, agrotextiles y biomantos, abriendo la puerta a una bioeconomía circular.',
        },
        { tipo: 'actividad', id: 'c4-bagazo-usos' },
        {
          tipo: 'parrafo',
          texto:
            'El cambio de mirada que esto supone es profundo. Lo que hoy se descarta como desecho —y que además genera un pasivo ambiental— podría convertirse en una segunda línea de ingresos para la misma familia que ya realiza el desfibrado, sin necesidad de sembrar una hectárea adicional. El insumo ya está allí, producido y disponible.',
        },
        {
          tipo: 'cita',
          texto: 'El noventa y seis por ciento que hoy se pierde es la mayor reserva sin explotar del sector fiquero.',
          fuente: 'Sobre el aprovechamiento del bagazo',
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    5: {
      ordinal: 'Capítulo cinco',
      titulo: 'El oficio artesanal: herramientas, telares y transmisión de saberes',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'En cuanto a la transformación artesanal, el oficio se sostiene gracias a la transmisión oral de generación en generación. No hay manual: hay maestro, aprendiz y repetición.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'La mayoría de los artesanos se dedican a la etapa del hilado, utilizando herramientas manuales y telares horizontales rústicos. Se trata de dispositivos construidos localmente, con materiales del entorno, ajustados a la medida de quien los usa y reparados por la misma persona que los opera. Esa autonomía técnica —la capacidad de fabricar y mantener la propia herramienta— es parte inseparable del oficio.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Aunque una gran proporción del hilo se destina a la elaboración de empaques agrícolas, un valioso porcentaje se transforma en artesanías diversificadas como tapetes, sombreros, individuales y alpargatas. La diferencia entre un destino y otro no está en la fibra, sino en la decisión de diseño y en el tiempo de trabajo que se le dedique.',
        },
        {
          tipo: 'foto',
          foto: 'uso_artesanal_fique',
          titulo: 'La herramienta del varillado',
          pie: 'Una vara amarrada al tronco de un árbol basta para montar el puesto de trabajo. El artesano fija la penca contra la vara y la arrastra hasta desprender la pulpa. Toda la tecnología del proceso cabe en un nudo bien hecho.',
        },
        { tipo: 'subtitulo', texto: 'El gesto del varillado' },
        {
          tipo: 'parrafo',
          texto:
            'El varillado exige una combinación precisa de fuerza y control. Demasiada presión rompe los filamentos y produce fibra corta, de menor valor; muy poca deja pulpa adherida que oscurece la cabuya durante el secado. Ese punto medio no se explica: se calibra con años de práctica y se corrige, en el aprendizaje, con la mano del maestro sobre la del aprendiz.',
        },
        { tipo: 'actividad', id: 'c5-varillado' },
        {
          tipo: 'parrafo',
          texto:
            'Por eso la desaparición de un artesano mayor no representa únicamente una pérdida afectiva para la comunidad. Representa la pérdida de un conjunto de criterios que no están escritos en ninguna parte: cómo reconocer una penca en punto, cuánto tiempo dejar la fibra en el agua según el clima de la semana, cómo leer el color del secado.',
        },
        {
          tipo: 'foto',
          foto: 'hombre_manipulando_fique',
          titulo: 'Extracción manual',
          pie: 'La fibra sale de la penca en un solo movimiento continuo. La calidad del manojo se juzga en ese instante: longitud, limpieza y ausencia de filamentos rotos.',
        },
        { tipo: 'subtitulo', texto: 'Del telar al producto' },
        {
          tipo: 'parrafo',
          texto:
            'En el acabado, el telar horizontal sigue siendo la herramienta dominante para las piezas de mayor formato. El ganchillo, más versátil y portátil, permite trabajar en tiempos fragmentados —entre las labores de la casa y las del cultivo— y por eso concentra buena parte de la producción de bolsos y accesorios.',
        },
        { tipo: 'actividad', id: 'c5-ganchillo' },
        { tipo: 'subtitulo', texto: 'La asociatividad como herramienta de supervivencia' },
        {
          tipo: 'parrafo',
          texto:
            'En esta fase, la asociatividad ha demostrado ser una herramienta clave de supervivencia, permitiendo a las comunidades preservar técnicas tradicionales como el teñido natural y mantener vivo el taller familiar. Su utilidad es concreta y verificable. Asociarse permite comprar insumos en volumen y a mejor precio; compartir equipos que ninguna familia podría adquirir por separado; sostener un estándar de calidad común que hace posible atender pedidos grandes; y, sobre todo, negociar directamente con el comprador final, reduciendo la dependencia del intermediario.',
        },
        { tipo: 'actividad', id: 'c5-asociatividad' },
        {
          tipo: 'caja',
          rotulo: 'Lo que se pierde sin organización',
          parrafos: [
            'Un artesano solo vende lo que alcanza a producir y acepta el precio que le ofrezcan. Un grupo organizado vende un catálogo, sostiene un inventario, responde a un pedido en firme y fija un precio con base en sus costos reales. La diferencia no es de escala: es de posición en la cadena.',
          ],
        },
        { tipo: 'subtitulo', texto: 'El teñido: color y territorio' },
        {
          tipo: 'parrafo',
          texto:
            'El teñido natural, realizado con pigmentos obtenidos de plantas y minerales de la región, constituye uno de los saberes más frágiles del oficio y, a la vez, uno de los de mayor potencial diferenciador en el mercado contemporáneo. Cada receta —qué planta, en qué proporción, cuánto tiempo, a qué temperatura— es un conocimiento local que no puede replicarse industrialmente sin perder su carácter.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Documentar esas recetas, con nombre de quien las aporta y detalle de sus proporciones, es una de las tareas más urgentes que enfrenta cualquier proceso de salvaguardia del oficio fiquero en Aratoca.',
        },
        {
          tipo: 'cita',
          texto: 'El saber no se pierde de golpe. Se pierde receta por receta, nombre por nombre, mano por mano.',
          fuente: 'Sobre la salvaguardia del oficio',
        },
      ],
    },

    /* ---------------------------------------------------------------- */
    6: {
      ordinal: 'Capítulo seis',
      titulo: 'Reflexiones finales: hacia la innovación y la sostenibilidad',
      bloques: [
        {
          tipo: 'entradilla',
          texto:
            'El fortalecimiento del tejido productivo en municipios de tradición fiquera, como Aratoca, requiere una mirada integral que fusione el respeto por la herencia con la urgencia de la innovación.',
        },
        {
          tipo: 'parrafo',
          capitular: true,
          texto:
            'Las páginas anteriores describieron un oficio con una profundidad histórica poco común y con una fragilidad presente igualmente notable. Ambas cosas son ciertas al mismo tiempo, y cualquier lectura que sacrifique una de las dos produce un diagnóstico incompleto: la celebración sin diagnóstico no cambia nada, y el diagnóstico sin reconocimiento del valor cultural conduce al abandono.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Es indispensable superar las tecnologías de bajo rendimiento y mitigar los impactos ambientales del procesamiento de la hoja. Al mismo tiempo, la organización comunitaria debe apuntar a la dignificación del trabajo artesanal, reduciendo la dependencia de intermediarios e impulsando la creación de valor agregado.',
        },
        { tipo: 'subtitulo', texto: 'Cuatro frentes de trabajo' },
        {
          tipo: 'parrafo',
          texto:
            'De todo lo expuesto se desprenden cuatro líneas de acción que resultan simultáneas y no sucesivas: ninguna de ellas rinde frutos si las demás se descuidan.',
        },
        {
          tipo: 'lista',
          items: [
            {
              titulo: 'Rendimiento técnico',
              texto:
                'Mejorar el desfibrado y el lavado sin desplazar al artesano de su propio proceso ni imponer tecnologías que el territorio no pueda mantener.',
            },
            {
              titulo: 'Gestión ambiental del bagazo',
              texto:
                'Convertir el noventa y seis por ciento residual en abonos, agrotextiles y biomantos, protegiendo al mismo tiempo las quebradas y nacimientos de las veredas.',
            },
            {
              titulo: 'Valor agregado y diseño',
              texto:
                'Diversificar más allá del costal ralo hacia productos que incorporen diseño contemporáneo sin abandonar la técnica que los hace únicos.',
            },
            {
              titulo: 'Comercialización directa',
              texto:
                'Reducir la cadena de intermediación mediante asociatividad, canales digitales y presencia en ferias, de modo que el margen se quede en el taller.',
            },
          ],
        },
        { tipo: 'actividad', id: 'c6-frentes' },
        { tipo: 'subtitulo', texto: 'El relevo generacional' },
        {
          tipo: 'parrafo',
          texto:
            'Ninguna de las líneas anteriores tiene sentido si no hay quién las ejecute dentro de veinte años. El desafío más serio que enfrenta el oficio fiquero no es tecnológico ni comercial: es demográfico. Los portadores del saber envejecen y las nuevas generaciones no encuentran en el oficio, tal como está estructurado hoy, una alternativa de ingreso comparable a la migración.',
        },
        { tipo: 'actividad', id: 'c6-desafio' },
        {
          tipo: 'parrafo',
          texto:
            'Revertir eso exige que el fique deje de presentarse a los jóvenes como una herencia que hay que conservar por deber y empiece a presentarse como lo que puede llegar a ser: un material con demanda creciente en mercados que valoran lo biodegradable, lo trazable y lo hecho a mano. La conversación cambia por completo cuando el argumento deja de ser la nostalgia y pasa a ser la oportunidad.',
        },
        {
          tipo: 'parrafo',
          texto:
            'El encuentro intergeneracional es, en ese sentido, el mecanismo más eficaz de salvaguardia disponible. Los artesanos mayores aportan criterio técnico y memoria; los jóvenes aportan lenguaje visual, manejo de herramientas digitales y acceso a canales de venta que antes no existían. Ninguno de los dos grupos puede sostener el oficio por separado.',
        },
        { tipo: 'actividad', id: 'c6-quien-aporta' },
        {
          tipo: 'caja',
          rotulo: 'Una tarea concreta y urgente',
          parrafos: [
            'Documentar. Registrar en audio y video las técnicas de los maestros que hoy están activos; consignar por escrito las recetas de teñido natural con nombre de su portador; levantar fichas de cada proceso con materiales, tiempos y costos reales.',
            'Es la tarea de menor costo y mayor retorno de todas las enumeradas en este capítulo, y la única cuya ventana de oportunidad se cierra sola con el paso del tiempo.',
          ],
        },
        { tipo: 'subtitulo', texto: 'Un vehículo de identidad' },
        {
          tipo: 'parrafo',
          texto:
            'El fique no es solo una materia prima: es un vehículo de identidad comunitaria que, al combinarse con emprendimiento y nuevas perspectivas técnicas, puede generar alternativas de ingresos reales y sostenibles para sus pobladores.',
        },
        {
          tipo: 'parrafo',
          texto:
            'Aratoca tiene a su favor una combinación que pocos municipios pueden reclamar: un saber técnico vivo, un paisaje productivo reconocible, una posición estratégica sobre el corredor turístico del cañón y una tradición documentada que se remonta al pueblo Guane. El reto no consiste en inventar un futuro para el fique, sino en organizar el que ya está ocurriendo en los talleres del municipio.',
        },
        {
          tipo: 'cita',
          texto:
            'Conservar ese saber no es mirar hacia atrás. Es asegurar que Aratoca conserve algo que sabe hacer mejor que nadie.',
          fuente: 'Cierre de la tercera parte',
        },
      ],
    },
  },

  glosario: {
    titulo: 'Glosario del oficio fiquero',
    intro:
      'Se recogen aquí los términos empleados a lo largo del libro, en el sentido en que los usan los artesanos y cultivadores de Aratoca y de la provincia de Guanentá. Se organizan por etapas del oficio y no en orden alfabético, para que puedan leerse siguiendo el recorrido de la fibra.',
    grupos: [
      {
        titulo: 'La planta y el cultivo',
        terminos: [
          { termino: 'Furcraea', definicion: 'Género botánico al que pertenece el fique, originario de Colombia, con cerca de veinte especies descritas.' },
          { termino: 'Penca', definicion: 'Hoja del fique. Larga, carnosa y de bordes espinosos; es la unidad de cosecha.' },
          { termino: 'Cogollo', definicion: 'Conjunto de hojas jóvenes del centro de la planta. Se conservan entre quince y veinte pencas para garantizar su regeneración.' },
          { termino: 'Mata', definicion: 'La planta individual de fique, considerada como unidad productiva dentro de la parcela.' },
          { termino: 'Maguey', definicion: 'Nombre local de la planta de fique y, en particular, del largo tallo floral que emite al cerrar su ciclo de vida.' },
        ],
      },
      {
        titulo: 'La extracción y la fibra',
        terminos: [
          { termino: 'Desfibrado', definicion: 'Operación de separar la fibra de la masa carnosa de la hoja. Puede ser manual (varillado) o maquinado.' },
          { termino: 'Varillado', definicion: 'Método manual y tradicional de desfibrado, en el que la penca se raspa contra una vara fija hasta desprender la pulpa.' },
          { termino: 'Desfibradora', definicion: 'Máquina que realiza mecánicamente la separación de la fibra, aumentando el rendimiento por jornada frente al varillado.' },
          { termino: 'Cabuya', definicion: 'Fibra útil extraída de la penca de fique. Por extensión, el hilo obtenido a partir de ella.' },
          { termino: 'Manojo', definicion: 'Unidad de manejo de la fibra: conjunto de filamentos atados que se lava, se seca y se comercializa en conjunto.' },
          { termino: 'Escarmenado', definicion: 'Paso del manojo seco por un cepillo de clavos para desenredar, pulir, limpiar y alinear la fibra.' },
          { termino: 'Hilado', definicion: 'Torsión de la fibra para formar hilo. El grosor y la tensión determinan el destino y el valor de la cabuya.' },
        ],
      },
      {
        titulo: 'El taller y los productos',
        terminos: [
          { termino: 'Telar horizontal', definicion: 'Estructura de madera, generalmente de construcción local, empleada para tejer piezas de mayor formato como tapetes y manteles.' },
          { termino: 'Ganchillo', definicion: 'Herramienta de tejido de una sola aguja, empleada sobre todo en la producción de bolsos y accesorios.' },
          { termino: 'Teñido natural', definicion: 'Coloración de la fibra con pigmentos obtenidos de plantas y minerales de la región, según recetas de transmisión oral.' },
          { termino: 'Costal ralo', definicion: 'Empaque agrícola de tejido abierto, producto tradicional del sector y hoy sustituido en gran medida por fibras sintéticas.' },
          { termino: 'Alpargata', definicion: 'Calzado tradicional de suela trenzada en fique. Su elaboración concentra una de las técnicas de mayor especialización del oficio.' },
          { termino: 'Individual', definicion: 'Pieza tejida de pequeño formato destinada a la mesa; junto con tapetes y manteles, integra la línea de decoración del hogar.' },
        ],
      },
      {
        titulo: 'Aprovechamiento y sostenibilidad',
        terminos: [
          { termino: 'Bagazo', definicion: 'Biomasa residual que queda tras el desfibrado. Corresponde a cerca del noventa y seis por ciento del peso de la hoja.' },
          { termino: 'Abono orgánico', definicion: 'Enmienda obtenida a partir de la descomposición controlada de material vegetal; uno de los destinos posibles del bagazo.' },
          { termino: 'Agrotextil', definicion: 'Tejido de uso agrícola empleado para cubrir, proteger o sostener cultivos; puede elaborarse a partir de fibra y residuo de fique.' },
          { termino: 'Biomanto', definicion: 'Manta vegetal biodegradable usada para controlar la erosión y estabilizar taludes, especialmente útil en terrenos de alta pendiente.' },
          { termino: 'Bioeconomía circular', definicion: 'Modelo productivo en el que los residuos de un proceso se convierten en insumos de otro, eliminando la noción de desecho.' },
        ],
      },
    ],
  },

  fuentes: {
    titulo: 'Fuentes y referencias',
    bloques: [
      { tipo: 'subtitulo', texto: 'Sobre la elaboración de este libro' },
      {
        tipo: 'parrafo',
        texto:
          'Los contenidos de esta primera edición se construyeron a partir de tres tipos de fuentes: el trabajo de documentación territorial adelantado en el municipio de Aratoca; la revisión de información pública disponible sobre el sector fiquero colombiano; y los testimonios de cultivadores y artesanos del municipio, recogidos durante el registro fotográfico que ilustra estas páginas.',
      },
      { tipo: 'subtitulo', texto: 'Entidades y organizaciones mencionadas' },
      {
        tipo: 'lista',
        items: [
          { titulo: 'Artesanías de Colombia', texto: 'Entidad que ha impulsado procesos de capacitación y de transformación de la fibra en las comunidades artesanas del país.' },
          { titulo: 'Coohilados del Fonce', texto: 'Organización con sede en San Gil, Santander, dedicada a la transformación de la fibra de fique.' },
          { titulo: 'Ecofibras', texto: 'Organización con sede en Curití, Santander, orientada a la producción de artesanías y productos derivados del fique.' },
          { titulo: 'Ministerio de las Culturas, las Artes y los Saberes', texto: 'Entidad rectora del Programa Nacional de Concertación Cultural, marco en el que se inscribe el proyecto que da origen a esta publicación.' },
        ],
      },
      { tipo: 'subtitulo', texto: 'Municipios de la franja fiquera santandereana' },
      {
        tipo: 'parrafo',
        texto:
          'Las provincias de Guanentá y Comunera concentran la producción departamental. Los municipios referenciados a lo largo de la obra son Aratoca, Curití, Mogotes, Onzaga, San Gil y San Joaquín.',
      },
      {
        tipo: 'caja',
        rotulo: 'Convocatoria a completar esta edición',
        parrafos: [
          'Esta obra se concibe como un documento abierto. Los artesanos, cultivadores, docentes e investigadores que deseen aportar correcciones, testimonios, recetas de teñido o fichas técnicas de proceso pueden dirigirse a la Secretaría de Cultura de la Alcaldía Municipal de Aratoca, con miras a una segunda edición ampliada.',
        ],
      },
    ],
  },

  creditos: {
    titulo: 'Créditos fotográficos',
    bloques: [
      {
        tipo: 'parrafo',
        texto:
          'Todas las fotografías de esta edición fueron registradas en el municipio de Aratoca, Santander.',
      },
      {
        tipo: 'lista',
        items: [
          { titulo: 'Cubierta', texto: 'Planta de fique en floración junto al camino veredal, con el cañón al fondo.' },
          { titulo: 'Lámina «El territorio»', texto: 'Vista panorámica del casco urbano de Aratoca desde la ladera.' },
          { titulo: 'Portadilla, Parte I', texto: 'Ladera cultivada y camino veredal sobre la vertiente del cañón.' },
          { titulo: 'Capítulo 1', texto: 'Planta de fique al borde del camino, en terreno de alta pendiente.' },
          { titulo: 'Lámina «El centro del municipio»', texto: 'Iglesia parroquial y plaza principal de Aratoca.' },
          { titulo: 'Portadilla, Parte II', texto: 'Pencas de fique recién cortadas y dispuestas junto al camino.' },
          { titulo: 'Capítulo 3', texto: 'Mástil floral del maguey sobre el paisaje del cañón.' },
          { titulo: 'Capítulo 5', texto: 'Vara de varillado amarrada al tronco; extracción manual de la fibra.' },
          { titulo: 'Lámina «Lavado artesanal»', texto: 'Enjuague y escurrido de la fibra en el punto de lavado.' },
          { titulo: 'Lámina «Desfibrado maquinado»', texto: 'Desfibradora mecánica en parcela del municipio.' },
          { titulo: 'Portadilla, Parte III', texto: 'Artesano trabajando la fibra en la ladera.' },
        ],
      },
      { tipo: 'subtitulo', texto: 'Nota sobre las cifras' },
      {
        tipo: 'parrafo',
        texto:
          'Los datos cuantitativos citados en los capítulos segundo y cuarto —hectáreas sembradas a nivel nacional, participación de familias campesinas e indígenas en el cultivo y rendimiento de fibra por hoja procesada— corresponden a los órdenes de magnitud reportados para el sector fiquero colombiano y se presentan como referencia de contexto, no como medición local del municipio de Aratoca.',
      },
      {
        tipo: 'caja',
        rotulo: 'Agradecimiento',
        parrafos: [
          'La Alcaldía Municipal de Aratoca agradece a las familias cultivadoras y artesanas que permitieron el registro fotográfico de su trabajo en parcela y en taller. Sin esa apertura, este libro no existiría.',
          'Esta obra fue posible gracias a las familias cultivadoras, desfibradoras, hilanderas y tejedoras de fique de Aratoca, que abrieron sus parcelas, sus talleres y su memoria.',
        ],
      },
    ],
  },

  colofon: {
    parrafos: [
      'Los saberes aquí documentados son patrimonio colectivo de las comunidades artesanas de Aratoca y de la provincia de Guanentá. Se autoriza la reproducción total o parcial con fines educativos, comunitarios y no comerciales, citando la fuente.',
      'Distribución gratuita. Prohibida su venta.',
      'Publicación institucional de la Alcaldía Municipal de Aratoca, en el marco del proyecto «Taller de Oficios del Fique: creatividad, tradición y emprendimiento en Aratoca».',
    ],
  },

  contracubierta: {
    parrafos: [
      'Durante generaciones, el fique fue en Aratoca mucho más que un cultivo: fue el oficio que sostuvo la casa y el hilo que unió a las familias campesinas de la provincia de Guanentá.',
      'Este libro reúne, por primera vez en un solo volumen, la historia larga de esa fibra —desde la herencia del pueblo Guane hasta la crisis de los años ochenta y la reinvención actual—, la descripción técnica de las seis fases que van de la penca al telar, y una lectura franca de los retos que enfrenta el sector.',
      'No es un homenaje nostálgico. Es una herramienta de trabajo para artesanos, jóvenes, docentes y gestores culturales que quieran entender —y transformar— el presente productivo del municipio.',
    ],
  },

  cierre: {
    titulo: 'Fin del recorrido',
    intro:
      'Has llegado al final de «Trenzando Saberes». El libro se entrega como punto de partida: lo que aquí se documenta sigue ocurriendo, cada día, en los talleres y las parcelas del municipio.',
    resumen: 'Respondiste {{respondidas}} de {{total}} actividades, y acertaste {{aciertos}} a la primera.',
    sinRespuestas: 'Todavía no has respondido ninguna actividad. Puedes volver atrás y probarlas: no se califican, están para pensar.',
    reiniciar: 'Empezar de nuevo',
  },

  enhorabuena: {
    titulo: '¡Enhorabuena!',
    texto:
      'Gracias por llegar hasta aquí: tu taller ha terminado. Esta última página existe solo porque las hojas de un libro tienen dos caras y a ésta le faltaba la suya. Aprovéchala: es tuya.',
    boton: 'Cerrar el libro',
  },

  actividades: {
    /* --- Capítulo 1 --- */
    'c1-algodon-o-fique': {
      pregunta: 'Los Guanes asignaban cada fibra a un uso distinto. ¿A cuál corresponde cada pieza?',
      grupos: ['Algodón', 'Fique'],
      items: ['Mantas finas', 'Mochilas', 'Prendas de abrigo', 'Tocados', 'Bolsas'],
      explicacion:
        'No era una jerarquía de prestigio, sino una asignación funcional: el algodón abrigaba; el fique cargaba, resistía y duraba.',
    },
    'c1-gremio': {
      pregunta: 'En Aratoca, un gremio cerrado guardaba la técnica del fique.',
      explicacion:
        'Falso. No existía un gremio cerrado ni un taller especializado que monopolizara la técnica: gran parte de la población campesina aprendía a hilar y a tejer desde la infancia. El saber estaba en las casas.',
    },
    'c1-vestigios': {
      pregunta: '¿Se conservan hoy muchas piezas textiles del pueblo Guane?',
      explicacion:
        'No. Las fibras vegetales son perecederas: se degradan con la humedad, el calor y el tiempo. Precisamente por eso, las pocas que sobrevivieron tienen un valor antropológico incalculable.',
    },

    /* --- Capítulo 2 --- */
    'c2-porcentaje-familias': {
      pregunta: '¿Qué proporción del fique del país cultivan familias campesinas e indígenas?',
      unidad: '%',
      tramos: [
        'Más de lo que crees: el fique no es un cultivo de agroindustria.',
        'Cerca del noventa y cinco por ciento. Es un cultivo de economía familiar.',
        'Ya casi: la cifra reportada ronda el noventa y cinco por ciento.',
      ],
      explicacion:
        'Cerca del 95% del fique nacional lo cultivan familias de estratos vulnerables y de ascendencia indígena o campesina, en miles de unidades pequeñas dispersas en zonas de ladera.',
    },
    'c2-limitaciones': {
      pregunta: '¿Qué dinámicas limitan hoy al sector fiquero? Marca todas las que correspondan.',
      opciones: [
        'Alta dependencia de intermediarios',
        'Bajos niveles de formalización laboral',
        'Necesidad de diversificar el producto',
        'Falta de tierra cultivable',
        'Exceso de agua en las parcelas',
      ],
      explicacion:
        'Las tres primeras son las que el capítulo nombra. El fique crece precisamente en las tierras que ningún otro cultivo quería, y requiere poca agua: ni la tierra ni el riego son el problema.',
    },

    /* --- Capítulo 3 --- */
    'c3-cogollo': {
      pregunta: 'Estás cosechando una mata de fique. ¿Cuántas pencas dejas en el cogollo?',
      unidad: 'pencas',
      tramos: [
        'Demasiado pocas. La planta pierde capacidad fotosintética, tarda en producir hojas nuevas y puede morir.',
        'Ese es el punto. Entre quince y veinte pencas garantizan la supervivencia y la regeneración de la mata.',
        'La mata sobrevive, pero estás dejando sin cosechar pencas que ya estaban en punto.',
      ],
      explicacion:
        'Dejar entre quince y veinte pencas en el cogollo no es una recomendación externa: es un criterio construido por los propios cultivadores a partir de la observación acumulada, transmitido oralmente durante generaciones.',
    },
    'c3-floracion': {
      pregunta: 'Después de florecer, la planta de fique vuelve a producir hojas.',
      explicacion:
        'Falso. La aparición del maguey anuncia el cierre del ciclo: la planta concentra sus reservas en la floración y, tras ella, muere. Por eso el cultivo se sostiene por renovación escalonada y no por la longevidad de cada mata.',
    },
    'c3-riego': {
      pregunta: '¿El fique necesita riego permanente?',
      explicacion:
        'No. Requiere poca agua, tolera periodos secos prolongados y se adapta a suelos de baja fertilidad y pendiente pronunciada. Eso lo convirtió históricamente en el cultivo de las tierras que ningún otro producto quería.',
    },

    /* --- Capítulo 4 --- */
    'c4-rendimiento': {
      pregunta: 'De una hoja de fique recién cortada, ¿cuánto se aprovecha como fibra útil?',
      unidad: '%',
      tramos: [
        'Un poco más, pero no mucho más.',
        'Alrededor del cuatro por ciento. Todo lo demás es bagazo.',
        'Bastante menos. El rendimiento real sorprende a casi todo el mundo.',
      ],
      explicacion:
        'Solo un 4% del peso de la hoja se convierte en cabuya. El 96% restante es biomasa residual —el bagazo— y es, al mismo tiempo, el mayor problema ambiental del oficio y su mayor reserva sin explotar.',
    },
    'c4-bagazo-usos': {
      pregunta: '¿Qué puede producirse a partir del bagazo? Marca todas las que correspondan.',
      opciones: [
        'Insecticidas naturales',
        'Abonos orgánicos',
        'Agrotextiles',
        'Biomantos para control de erosión',
        'Combustible para motores',
      ],
      explicacion:
        'Las cuatro primeras son las que señalan las investigaciones recientes, y abren la puerta a una bioeconomía circular: el insumo ya está allí, producido y disponible, sin sembrar una hectárea adicional.',
    },
    'c4-remojo': {
      pregunta: '¿Cuántas horas debe permanecer la fibra sumergida antes del secado?',
      unidad: 'horas',
      tramos: [
        'Muy poco tiempo: quedan residuos de pulpa y jugos adheridos que oscurecen y manchan la cabuya.',
        'Correcto. Entre doce y quince horas retiran la pulpa sin castigar la fibra.',
        'Más tiempo del necesario, con mayor consumo de agua y sin ganancia de calidad.',
      ],
      explicacion:
        'El lavado es el punto crítico del proceso: define la calidad comercial de la fibra y concentra, a la vez, el mayor impacto ambiental del oficio sobre las quebradas de la vereda.',
    },

    /* --- Capítulo 5 --- */
    'c5-varillado': {
      pregunta: 'Estás varillando una penca contra la vara. ¿Cuánta presión aplicas?',
      unidad: '',
      tramos: [
        'Poca presión: queda pulpa adherida, y esa pulpa oscurecerá la cabuya durante el secado.',
        'Ese es el punto medio: la fibra sale limpia, larga y entera.',
        'Demasiada presión: los filamentos se rompen y queda fibra corta, de menor valor.',
      ],
      explicacion:
        'El varillado exige una combinación precisa de fuerza y control. Ese punto medio no se explica: se calibra con años de práctica y se corrige, en el aprendizaje, con la mano del maestro sobre la del aprendiz.',
    },
    'c5-asociatividad': {
      pregunta: '¿Qué permite la asociatividad a un taller familiar? Marca todas las que correspondan.',
      opciones: [
        'Comprar insumos en volumen y a mejor precio',
        'Compartir equipos que ninguna familia podría adquirir sola',
        'Sostener un estándar de calidad común',
        'Negociar directamente con el comprador final',
        'Eliminar la necesidad del teñido natural',
      ],
      explicacion:
        'Las cuatro primeras. La asociatividad no sustituye técnicas: al contrario, es precisamente lo que ha permitido preservar saberes frágiles como el teñido natural. La diferencia no es de escala, es de posición en la cadena.',
    },
    'c5-ganchillo': {
      pregunta: '¿Usarías ganchillo para tejer un tapete de gran formato?',
      explicacion:
        'No. Para las piezas de mayor formato el telar horizontal sigue siendo la herramienta dominante. El ganchillo, más versátil y portátil, concentra la producción de bolsos y accesorios porque permite trabajar en tiempos fragmentados.',
    },

    /* --- Capítulo 6 --- */
    'c6-frentes': {
      pregunta: '¿Cuáles de estos frentes de trabajo propone el libro? Marca todos los que correspondan.',
      opciones: [
        'Rendimiento técnico',
        'Gestión ambiental del bagazo',
        'Valor agregado y diseño',
        'Comercialización directa',
      ],
      explicacion:
        'Los cuatro. Y el capítulo insiste en algo más: son simultáneas y no sucesivas. Ninguna de ellas rinde frutos si las demás se descuidan.',
    },
    'c6-desafio': {
      pregunta: 'El mayor desafío que enfrenta hoy el oficio fiquero es tecnológico.',
      explicacion:
        'Falso. El desafío más serio no es tecnológico ni comercial: es demográfico. Los portadores del saber envejecen y las nuevas generaciones no encuentran en el oficio, tal como está estructurado hoy, una alternativa de ingreso comparable a la migración.',
    },
    'c6-quien-aporta': {
      pregunta: 'En el encuentro intergeneracional, ¿qué aporta cada grupo?',
      grupos: ['Artesanos mayores', 'Jóvenes'],
      items: [
        'Criterio técnico',
        'Memoria del oficio',
        'Lenguaje visual',
        'Manejo de herramientas digitales',
        'Acceso a canales de venta',
      ],
      explicacion:
        'Ninguno de los dos grupos puede sostener el oficio por separado. Por eso el encuentro intergeneracional es el mecanismo de salvaguardia más eficaz disponible.',
    },
  },
};
