import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCheck, ChefHat, MoveHorizontal, Plus, X } from 'lucide-react';
import { findEquipment } from '../data/equipmentCatalog';
import { KITCHEN_ZONES } from '../data/kitchenLayout';
import { APPROVED_VISUALS } from '../data/visualAssets';
import { EquipmentCatalogPanel } from './EquipmentCatalogPanel';
import { DesignAction } from './DesignUI';

interface Props {
  selectedEquipment: string[];
  onToggle: (tool: string) => void;
  onNext?: () => void;
  disabled?: boolean;
}

export function KitchenEquipmentScene({ selectedEquipment, onToggle, onNext, disabled }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef({ start: 0, scroll: 0, active: false, moved: false });
  const navigationZone = useRef(0);
  const panningTo = useRef<number | null>(null);
  const [activeZone, setActiveZone] = useState(0);
  const [dragging, setDragging] = useState(false);

  const goTo = (index: number) => {
    navigationZone.current = index;
    const element = viewport.current;
    if (element) {
      panningTo.current = (element.scrollWidth - element.clientWidth) * index / (KITCHEN_ZONES.length - 1);
      element.scrollTo({
        left: panningTo.current,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return <>
    <div className="panoramic-layout">
      <div className="panorama-card">
        <div className="panorama-toolbar">
          <span className="panorama-room-title"><span className="panorama-room-dot" />THE EVERYDAY KITCHEN</span>
          <span className="panorama-gesture"><MoveHorizontal size={15} aria-hidden="true" /><span>Drag or swipe to explore</span></span>
          <span className="panorama-page"><strong>0{activeZone + 1}</strong><i>/ 04</i></span>
        </div>
        <div
          ref={viewport}
          className={'panorama-viewport' + (dragging ? ' is-dragging' : '')}
          tabIndex={0}
          role="region"
          aria-label="Panoramic kitchen. Drag, swipe or use arrow keys to explore four zones."
          onScroll={event => {
            const element = event.currentTarget;
            const zone = Math.min(3, Math.round(element.scrollLeft / Math.max(1, element.scrollWidth - element.clientWidth) * 3));
            setActiveZone(zone);
            if (panningTo.current !== null && Math.abs(element.scrollLeft - panningTo.current) < 2) panningTo.current = null;
            if (panningTo.current === null) navigationZone.current = zone;
          }}
          onKeyDown={event => {
            if (event.target !== event.currentTarget) return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              goTo(Math.max(0, Math.min(3, navigationZone.current + (event.key === 'ArrowRight' ? 1 : -1))));
            } else if (event.key === 'Home' || event.key === 'End') {
              event.preventDefault();
              goTo(event.key === 'Home' ? 0 : 3);
            }
          }}
          onPointerDown={event => {
            panningTo.current = null;
            navigationZone.current = activeZone;
            if (event.pointerType !== 'mouse' || event.button !== 0) return;
            drag.current = { start: event.clientX, scroll: event.currentTarget.scrollLeft, active: true, moved: false };
          }}
          onWheel={() => { panningTo.current = null; }}
          onPointerMove={event => {
            const state = drag.current;
            if (!state.active) return;
            const delta = event.clientX - state.start;
            if (Math.abs(delta) > 6) {
              state.moved = true;
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            if (state.moved) event.currentTarget.scrollLeft = state.scroll - delta;
          }}
          onPointerUp={endDrag}
          onPointerCancel={event => { endDrag(event); drag.current.moved = false; }}
          onPointerLeave={() => { if (!drag.current.moved) drag.current.active = false; }}
          onClickCapture={event => {
            if (drag.current.moved) {
              event.preventDefault();
              event.stopPropagation();
              drag.current.moved = false;
            }
          }}
        >
          <div className="panorama-track">
            <img src={APPROVED_VISUALS.panorama}
              alt="Sunlit forest-green kitchen with stone counters, brass details, and cooking, preparation, appliance and storage areas"
              width="2172" height="724" draggable={false} decoding="async" fetchPriority="high" />
            {KITCHEN_ZONES.map((zone, index) => <div className="panorama-zone" key={zone.name}>
              <div className="panorama-zone-label">
                <span>0{index + 1} / YOUR KITCHEN</span><h2>{zone.name}</h2><p>{zone.description}</p>
              </div>
              {zone.tools.map(([id, x, y]) => {
                const tool = findEquipment(id);
                if (!tool) return null;
                const selected = selectedEquipment.includes(tool.name);
                return <button type="button" key={id}
                  className={'panorama-tool' + (selected ? ' is-selected' : '')}
                  style={{ left: x + '%', top: y + '%' }}
                  data-equipment={id} aria-label={tool.name} aria-pressed={selected} onClick={() => onToggle(tool.name)}
                  onFocus={event => {
                    if (event.currentTarget.matches(':focus-visible')) {
                      event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
                    }
                  }}>
                  <span className="panorama-tool-status">{selected ? <Check size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}</span>
                  <span>{tool.name}</span>
                </button>;
              })}
            </div>)}
          </div>
        </div>
        <nav className="panorama-navigation" aria-label="Kitchen zones">
          <button type="button" aria-label="Explore previous kitchen zone" disabled={activeZone === 0} onClick={() => goTo(activeZone - 1)}><ArrowLeft size={17} /></button>
          <div className="panorama-map">
            {KITCHEN_ZONES.map((zone, index) => <button type="button" key={zone.name} aria-current={activeZone === index ? 'step' : undefined} onClick={() => goTo(index)}>
              <span className="map-line" /><span className="map-caption"><small aria-hidden="true">0{index + 1}</small>{zone.name}</span>
            </button>)}
          </div>
          <button type="button" aria-label="Explore next kitchen zone" disabled={activeZone === 3} onClick={() => goTo(activeZone + 1)}><ArrowRight size={17} /></button>
        </nav>
        <div className="panorama-footnote"><span><CheckCheck size={14} aria-hidden="true" />Selections stay with you as you explore.</span><span>FOUR SPACES. ONE KITCHEN.</span></div>
      </div>
      <aside className="kitchen-inventory panorama-summary" aria-label="Your selected kitchen tools">
        <span className="eyebrow"><ChefHat size={16} aria-hidden="true" />PERSONAL TO YOU</span>
        <h3>Your kitchen.<br />Your possibilities.</h3>
        <p>A good meal starts with what you have. Make this space your own.</p>
        <div className="panorama-count">
          <strong aria-hidden="true">{String(selectedEquipment.length).padStart(2, '0')}</strong>
          <span aria-live="polite" aria-atomic="true"><b>{selectedEquipment.length} tools selected</b><span>Ready for a little inspiration.</span></span>
        </div>
        <span className="panorama-list-label">IN YOUR KITCHEN</span>
        <div className="selected-tools" aria-label="Selected kitchen tools">
          {selectedEquipment.length ? selectedEquipment.map(name => <button type="button" key={name} aria-label={'Remove ' + name + ' from your kitchen'} onClick={() => onToggle(name)}>
            <Check size={13} aria-hidden="true" /><span>{name}</span><X size={13} aria-hidden="true" />
          </button>) : <p>Tap the tools you own. Even a simple setup can make something delicious.</p>}
        </div>
        <div className="panorama-reassurance"><CheckCheck size={16} aria-hidden="true" /><span>Your choices stay selected,<br />wherever you explore.</span></div>
        <div className="inventory-bottom">
          {onNext && <DesignAction onClick={onNext} disabled={disabled}>Find my meals</DesignAction>}
          <p>Made for your tools. Matched to your taste.</p>
        </div>
      </aside>
      {onNext && <div className="kitchen-mobile-dock">
        <span><strong>{selectedEquipment.length} tools selected</strong><small>Your kitchen, your possibilities.</small></span>
        <DesignAction onClick={onNext} disabled={disabled}>Find my meals</DesignAction>
      </div>}
    </div>
    <EquipmentCatalogPanel selected={selectedEquipment} onToggle={onToggle} includeAll />
  </>;
}
