'use client';

export default function InterpretationPanel() {
  return (
    <div className="space-y-4">
      {/* Interpretation Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Date de l&apos;interprétation:</span>
          <span className="font-medium">2020/06/24</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Interpréteur:</span>
          <div className="flex items-center gap-1">
            <span className="font-medium">Elsa Lyon</span>
          </div>
        </div>
      </div>

      {/* Conclusion Section */}
      <div className="border-t border-gray-200 pt-3">
        <h4 className="font-medium text-gray-900 mb-2">
          Conclusion de l&apos;interprétation
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">
          L&apos;examen montre une activité cérébrale de fond normale, avec
          quelques anomalies localisées (décharges ponctuelles), surtout au
          niveau temporal droit. Ces signes sont compatibles avec de
          l&apos;épilepsie focale, bien que aucune crise n&apos;ait été
          enregistrée. Une prise en charge adaptée et un suivi EEG sont
          recommandés.
        </p>
      </div>

      {/* Download Button */}
      <div className="border-t border-gray-200 pt-3">
        <button
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            // Handle download functionality
            console.log('Download interpretation file');
          }}
        >
          ↓ Télécharger la fiche interprétation
        </button>
      </div>
    </div>
  );
}
