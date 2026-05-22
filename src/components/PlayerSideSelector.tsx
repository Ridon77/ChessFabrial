import { VISIBLE_PLAYER_SIDES } from '../config/featureFlags';
import { useLanguage } from '../i18n/useLanguage';
import { gameModeKey } from '../i18n/translations';
import { gameModeFromPlayerSide } from '../types/GameMode';
import type { PlayerSide } from '../types/PlayerSide';

interface PlayerSideSelectorProps {
  value: PlayerSide;
  onChange: (side: PlayerSide) => void;
}

export function PlayerSideSelector({ value, onChange }: PlayerSideSelectorProps) {
  const { t } = useLanguage();

  const handleSelect = (side: PlayerSide) => {
    if (side !== value) {
      onChange(side);
    }
  };

  return (
    <fieldset className="selector player-side-selector">
      <legend>{t('playerSide.legend')}</legend>
      <p className="selector-hint">{t('playerSide.help')}</p>
      <div className="side-options">
        {VISIBLE_PLAYER_SIDES.map((side) => {
          const mode = gameModeFromPlayerSide(side);
          return (
            <label
              key={side}
              className={`side-option${value === side ? ' side-option--active' : ''}`}
            >
              <input
                type="radio"
                name="playerSide"
                value={side}
                checked={value === side}
                onChange={() => handleSelect(side)}
              />
              <span className="side-option-label">
                {side === 'white' ? t('playerSide.white') : t('playerSide.black')}
              </span>
              <span className="side-option-tag">{t(gameModeKey(mode))}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
