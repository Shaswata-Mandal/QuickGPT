import React from 'react'
import { useAppContext } from '../../context/AppContext'
import { AVAILABLE_MODELS } from '../../assets/assets';

const AiModelOptions = () => {

  const { selectedModel, setSelectedModel } = useAppContext();

  return (
    <div className="flex flex-col gap-3 w-full">

      <p className="text-xs px-2 py-2 bg-gray-200 border border-gray-300 rounded-md">
        Choose your preferred model from the available options.
      </p>

      <div className='flex flex-col gap-3 overflow-y-scroll'>

        {AVAILABLE_MODELS.map((model) => {

          const isSelected = selectedModel === model.id;

          return (

            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`
              cursor-pointer p-3 rounded-md border transition-all
              ${isSelected
                  ? "border-primary bg-primary/40 dark:bg-primary/20"
                  : "border-gray-200 dark:border-white/40 hover:bg-gray-100 dark:hover:bg-white/5"}
            `}
            >

              {/* Header */}
              <div className="flex items-start gap-3">

                {/* Icon */}
                <div className="text-2xl">
                  <img src={model.icon} className='w-10 h-10 rounded-md border border-black/80 dark:border-gray-400 bg-white' alt="" />
                </div>

                {/* Text */}
                <div className="flex-1 flex flex-col gap-1">

                  <div className="flex items-center gap-2">

                    <h3 className="text-sm font-semibold dark:invert">
                      {model.name}
                    </h3>

                    {model.recommended && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md ml-auto bg-green-500 text-white">
                        Recommended
                      </span>
                    )}

                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {model.tagline}
                  </p>

                </div>

              </div>

              {/* Description */}
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                {model.description}
              </p>

              {/* Meta */}
              <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                <p><strong>Best for:</strong> {model.bestFor}</p>
                <p><strong>Rate limit:</strong> {model.rateLimit}</p>
              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}

export default AiModelOptions