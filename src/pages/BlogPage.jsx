import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { PenTool, Rss } from 'lucide-react';

    const BlogPage = () => {
        // Placeholder blog posts
        const posts = [
            { id: 1, title: "10 Dicas Essenciais para sua Viagem ao Deserto do Atacama", date: "10 de Maio, 2025", excerpt: "Prepare-se para a aventura no deserto mais árido do mundo com estas dicas imperdíveis...", imageKey: "atacama-blog-thumb", category: "Dicas de Viagem" },
            { id: 2, title: "A Melhor Época para Visitar Torres del Paine", date: "02 de Maio, 2025", excerpt: "Descubra quando ir para a Patagônia para aproveitar ao máximo o trekking e as paisagens...", imageKey: "torres-paine-blog-thumb", category: "Destinos" },
            { id: 3, title: "Gastronomia Chilena: Sabores que Você Precisa Experimentar", date: "25 de Abril, 2025", excerpt: "De empanadas a curanto, um guia delicioso pela culinária do Chile...", imageKey: "chilean-food-blog-thumb", category: "Cultura" },
        ];

        return (
            <div className="container py-12 md:py-16">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-primary tracking-tight flex items-center justify-center gap-3">
                        <PenTool className="w-8 h-8 md:w-10 md:h-10" /> Blog de Viagens Alliance
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                        Dicas, inspirações e novidades para sua próxima aventura no Chile.
                    </p>
                </motion.div>

                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col border border-border/60"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img 
                                      class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                      alt={`Imagem do post: ${post.title}`} src="https://images.unsplash.com/photo-1528605248644-14dd04022da1" />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <span className="text-xs font-semibold text-primary uppercase mb-1">{post.category}</span>
                                    <h2 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
                                        <Link to={`/blog/post/${post.id}`}>{post.title}</Link>
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-3 flex-grow">{post.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                        <span>{post.date}</span>
                                        <Link to={`/blog/post/${post.id}`} className="text-primary hover:underline">Ler Mais</Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center py-10"
                    >
                        <Rss className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Nosso blog está quase pronto!</h2>
                        <p className="text-muted-foreground">Em breve, compartilharemos dicas e histórias incríveis sobre viagens ao Chile.</p>
                    </motion.div>
                )}

                {/* Placeholder for pagination or load more button */}
                {posts.length > 3 && (
                    <div className="text-center mt-12">
                        <Button variant="outline">Carregar Mais Posts</Button>
                    </div>
                )}
            </div>
        );
    };

    export default BlogPage;