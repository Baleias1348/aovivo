import React from 'react';
    import { motion } from 'framer-motion';
    import { Building, Target, Eye } from 'lucide-react';

    const AboutPage = () => {
        const foundationYear = "2015";

        return (
            <div className="container py-12 md:py-16 space-y-16">
                 <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary tracking-tight">
                        Sobre a Alliance Vacation
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Conectando viajantes com experiências autênticas no Chile e no mundo.
                    </p>
                </motion.div>

                 <motion.section
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-semibold text-secondary flex items-center gap-3">
                            <Building className="w-7 h-7" /> Nossa História
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            A Alliance Vacation nasceu da paixão por viajar e descobrir. Fundada em {foundationYear}, começamos como uma pequena equipe com um grande sonho: tornar viagens significativas acessíveis a todos. Acreditamos que viajar enriquece a alma, expande horizontes e cria memórias para toda a vida.
                        </p>
                         <p className="text-muted-foreground leading-relaxed">
                            Ao longo dos anos, crescemos e evoluímos, mas nosso compromisso central permanece o mesmo: oferecer um serviço excepcional, itinerários cuidadosamente elaborados e um profundo respeito pelas culturas e ambientes que visitamos, com foco especial na beleza do Chile.
                        </p>
                    </div>
                     <div className="rounded-lg overflow-hidden shadow-lg">
                         <img  class="w-full h-auto object-cover aspect-video" alt="Equipe da Alliance Vacation sorrindo em uma paisagem chilena" src="https://images.unsplash.com/photo-1624864005286-87dd57af16f3" />
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8 md:p-12 rounded-lg border"
                >
                    <div className="space-y-3">
                         <h3 className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
                            <Target className="w-6 h-6" /> Nossa Missão
                        </h3>
                        <p className="text-muted-foreground">
                            Inspirar e facilitar experiências de viagem autênticas e transformadoras que conectem as pessoas com o Chile e o mundo, promovendo um turismo responsável e sustentável.
                        </p>
                    </div>
                     <div className="space-y-3">
                        <h3 className="text-xl md:text-2xl font-semibold text-secondary flex items-center gap-3">
                             <Eye className="w-6 h-6" /> Nossa Visão
                        </h3>
                         <p className="text-muted-foreground">
                            Ser a agência de viagens líder no Chile, reconhecida por nossa inovação, serviço personalizado excepcional e compromisso com a criação de um impacto positivo nas comunidades e destinos que tocamos.
                        </p>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                    className="text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-8">
                        Conheça Nossa Equipe (Em Breve)
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Temos orgulho de nossa equipe de especialistas em viagens apaixonados e dedicados. Em breve apresentaremos as pessoas que tornam suas aventuras no Chile possíveis.
                    </p>
                </motion.section>

            </div>
        );
    };

    export default AboutPage;