'use client';

import {
  AnimauxIcon,
  ExamensIcon,
  MenuCard,
  MessagerieIcon,
  ProfileIcon,
} from '@app-test2/shared-components';

export default function MenuBlock() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <div className="flex flex-wrap gap-3 ">
        <MenuCard
          href="/examens"
          icon={<ExamensIcon className="w-8 h-8 text-blue" />}
          title="Examens"
          description="Retrouvez ici toutes vos fiches d'examens."
          action={{
            text: 'Créer un nouvel examen',
            onClick: () => console.log('new examen'),
          }}
        />
        <MenuCard
          href="#"
          icon={<AnimauxIcon className="w-8 h-8 text-blue" />}
          title="Animaux"
          description="Accéder à la liste des animaux."
          action={{
            text: 'Créer une nouvelle fiche animal',
            onClick: () => console.log('new animal'),
          }}
        />
      </div>
      <div className="flex flex-wrap gap-3 justify-center items-center">
        <MenuCard
          href="#"
          icon={<ProfileIcon className="w-8 h-8 text-blue" />}
          title="Mon profil"
          description="Modifiez vos informations de profil."
        />
        <MenuCard
          href="#"
          icon={<MessagerieIcon className="w-8 h-8 text-blue" />}
          title="Messagerie"
          description="Consulter et répondre à vos messages."
        />
      </div>
    </div>
  );
}
