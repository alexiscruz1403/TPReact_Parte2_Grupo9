import React, { useState } from 'react';
import Card from '../card/Card';
import { LoaderCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const List = ({ items, emptyMessage, isLoading, actualizarListaFavoritos }) => {
  const { t } = useTranslation();

  return (
    <>
      {isLoading
      ?(
        <div className="flex justify-center items-center h-80 gap-2 text-xl">
          <LoaderCircle className="animate-spin"/>
          <p>{t('loading.text')}</p>
        </div>
      )
      :items.length!==0
        ?
        (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card
                key={item.nombre}
                nombre={item.nombre}
                cambiarEstadoFavorito={actualizarListaFavoritos}
              />
            ))}
          </div>
        )
        :(
          <div className="flex justify-center items-center h-80">
            <p className="text-2xl font-bold">{emptyMessage}</p>
          </div>
        )
      }
    </>
  );

};

export default List;
