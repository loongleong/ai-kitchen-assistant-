import React, { useState, useEffect, useRef } from 'react';
import { Recipe, CookingStep } from '../types';
import { FoodVisual } from './FoodVisual';
import { useNativeModal } from './DesignUI';
import { APPROVED_VISUALS } from '../data/visualAssets';
import { ArrowLeft, ArrowRight, Check, Leaf, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface CookingModeModalProps {
  recipe: Recipe;
  onExit: () => void;
  isHealthierMode: boolean;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  onExit,
  isHealthierMode
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const modalRef = useNativeModal();
  const instructionRef = useRef<HTMLDivElement>(null);

  // Keep the current action and its written guidance visible after a step change.
  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    instructionRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStepIndex]);
  
  // Timer state
  const currentStep = recipe.steps[currentStepIndex] || recipe.steps[0];
  const initialSeconds = (currentStep.timerMinutes || 3) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Reset timer when changing steps
  useEffect(() => {
    setIsTimerRunning(false);
    setSecondsRemaining((currentStep.timerMinutes || 3) * 60);
  }, [currentStepIndex, currentStep.timerMinutes]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.round(((currentStepIndex + 1) / recipe.steps.length) * 100);


  // These are photographic references; recipe steps and countdowns remain authoritative.
  const renderDemonstrationGraphic = (step: CookingStep) => {
    const stage = step.visualType === 'prep' ? 'prep' : /sear|fry|toss|caramel/i.test(step.instruction) ? 'sear' : 'sauce';
    const plated = step.visualType === 'plate';
    const showRecipeDish = plated || !/chicken/i.test(step.instruction) || !recipe.ingredients.some(ingredient => /chicken/i.test(ingredient.name));
    const dishId = isHealthierMode && recipe.id === 'creamy-chicken-pasta' ? 'healthier-chicken-pasta' : recipe.id;
    const sceneSource = stage==='sear' ? APPROVED_VISUALS.cooking : stage==='prep' ? '/images/cooking-prep.webp' : '/images/cooking-sauce.webp';
    return <div className="cooking-scene-photo" key={step.stepNumber}>{showRecipeDish ? <FoodVisual dishId={dishId} priority/> : <FoodVisual src={sceneSource} alt={stage==='prep'?'Chicken, ginger and garlic on a cutting board':stage==='sear'?'Photographic reference of chicken searing in a wok':'Chicken simmering in soy and garlic sauce'} priority/>}</div>;
  };

  return (
    <dialog ref={modalRef} className="cooking-mode savor-design" aria-labelledby="cooking-recipe-title" onCancel={event=>{event.preventDefault();onExit()}}>
      <header className="cooking-bar">
        <button className="back-link" onClick={onExit}><ArrowLeft size={16}/>Exit Cooking</button>
        <h2 id="cooking-recipe-title">{recipe.name}{isHealthierMode && <span className="cooking-health-badge">Healthier Swap</span>}</h2>
        <button className="voice-toggle" aria-pressed={aiVoiceEnabled} onClick={()=>setAiVoiceEnabled(!aiVoiceEnabled)}>{aiVoiceEnabled?<Volume2 size={17}/>:<VolumeX size={17}/>}AI Voice {aiVoiceEnabled?'ON':'OFF'}</button>
      </header>
      <div className="cooking-layout">
        <div className="cooking-stage">
          {renderDemonstrationGraphic(currentStep)}
          <span className="stage-tag"><span className="live-dot"/>A LITTLE FOCUS. A LOT OF FLAVOUR.</span>
          <div className="stage-bottom"><span>IN YOUR ELEMENT.</span><p>One small step.<br/>Something delicious.</p></div>
          <span className="stage-note">Photographic guidance · follow the written recipe</span>
        </div>
        <div ref={instructionRef} className="cooking-instructions">
          <div className="cooking-step-count"><span>STEP {String(currentStepIndex+1).padStart(2,'0')} / {String(recipe.steps.length).padStart(2,'0')}</span><span>{progressPercentage}% complete</span></div>
          <div className="cooking-progress" aria-label="Cooking progress">{recipe.steps.map((step,index)=><span key={step.stepNumber} className={index<=currentStepIndex?'done':''}/>)}</div>
          <span className="eyebrow">Estimated {currentStep.timerMinutes || 3} minutes</span>
          <h1 key={currentStep.stepNumber}>{currentStep.title}</h1>
          <p className="step-instruction">{currentStep.instruction}</p>
          <div className="cooking-cue"><span className="eyebrow">WHAT TO LOOK FOR</span><p>{currentStep.whatToLookFor}</p></div>
          {currentStep.tip && <div className="cooking-tip"><Leaf size={18}/><div><span className="eyebrow">A LITTLE TIP</span><p>{currentStep.tip}</p></div></div>}
          {aiVoiceEnabled && <details className="cooking-voice"><summary><Volume2 size={15}/>Warm Chef · text guidance preview</summary><p>“{currentStep.instruction.split('.')[0]}. Remember: {currentStep.whatToLookFor}”</p><small>Voice preference is preserved. Audio playback is not connected.</small></details>}
          <div className="timer">
            <div><span className="eyebrow">SUGGESTED STEP TIMER</span><strong aria-live="off">{formatTime(secondsRemaining)}</strong>{secondsRemaining===0 && <span role="status">Time is up</span>}</div>
            <button aria-label={isTimerRunning?'Pause Timer':'Start Timer'} onClick={()=>setIsTimerRunning(!isTimerRunning)}>{isTimerRunning?<Pause size={20}/>:<Play size={20}/>}</button>
            <button aria-label="Reset Timer" onClick={()=>{setIsTimerRunning(false);setSecondsRemaining((currentStep.timerMinutes||3)*60)}}><RotateCcw size={19}/></button>
          </div>
          <div className="cooking-controls"><button className="text-button" disabled={currentStepIndex===0} onClick={()=>setCurrentStepIndex(Math.max(0,currentStepIndex-1))}><ArrowLeft size={16}/>Previous Step</button>
            {currentStepIndex<recipe.steps.length-1?<button className="action" onClick={()=>setCurrentStepIndex(currentStepIndex+1)}>Next Step<ArrowRight size={17}/></button>:<button className="action" onClick={onExit}>Complete &amp; Enjoy Meal<Check size={17}/></button>}
          </div>
          <p className="subtle">Your pace. Your kitchen. We’re right here.</p>
        </div>
      </div>
    </dialog>
  );
};
