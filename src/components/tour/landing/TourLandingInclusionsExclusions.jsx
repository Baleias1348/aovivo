import React from 'react';
    import { CheckCircle, XCircle, ListChecks } from 'lucide-react';

    const SectionContent = ({ title, items, icon: Icon, iconColorClass, textColorClass, isHtml = false }) => {
      if (!items || (typeof items === 'string' && !items.trim()) || (Array.isArray(items) && items.length === 0)) {
        return null;
      }

      return (
        <div className="p-6 bg-card rounded-lg shadow-sm border">
          <div className={`flex items-center mb-4 ${textColorClass}`}>
            <Icon size={24} className={`mr-3 ${iconColorClass}`} />
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
          {isHtml ? (
            <div 
              className="prose prose-sm sm:prose lg:prose-lg max-w-none text-muted-foreground space-y-2"
              dangerouslySetInnerHTML={{ __html: items }}
            />
          ) : (
            <ul className="space-y-2 text-muted-foreground">
              {Array.isArray(items) && items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Icon size={18} className={`mr-2 mt-1 flex-shrink-0 ${iconColorClass}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };


    const TourLandingInclusionsExclusions = ({ includes, excludes }) => {
      const hasIncludes = includes && ( (typeof includes === 'string' && includes.trim() !== '') || (Array.isArray(includes) && includes.length > 0) );
      const hasExcludes = excludes && ( (typeof excludes === 'string' && excludes.trim() !== '') || (Array.isArray(excludes) && excludes.length > 0) );

      if (!hasIncludes && !hasExcludes) {
        return null; 
      }

      return (
        <section className="space-y-8">
          <div className="flex items-center text-primary mb-4">
            <ListChecks size={28} className="mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold">O que está Incluso e o que Não Está</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasIncludes && (
              <SectionContent 
                title="Incluso no Passeio" 
                items={includes} 
                icon={CheckCircle} 
                iconColorClass="text-green-500" 
                textColorClass="text-green-700"
                isHtml={true}
              />
            )}
            {hasExcludes && (
              <SectionContent 
                title="Não Incluso" 
                items={excludes} 
                icon={XCircle} 
                iconColorClass="text-red-500" 
                textColorClass="text-red-700"
                isHtml={true}
              />
            )}
          </div>
        </section>
      );
    };

    export default TourLandingInclusionsExclusions;