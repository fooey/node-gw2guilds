import { random } from 'lodash';
import React from 'react';
import { EmblemSVG } from '~/components/EmblemSVG';
import {
  backgroundIds,
  DEFAULT_BG_COLORID,
  EMBLEM_SWATCH_SIZE,
  maxBackgroundId,
  minBackgroundId,
} from '~/lib/emblem/constants';
import { colorsById } from '~/lib/emblem/resources';
import { getBgUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';
import { ColorSelection } from './colors';
import { FlagToggle, LayerOptions, LayerPreview, PickerDialog } from './utils';

interface IBackgroundOptionsProps {
  emblem: IGuildEmblem;
  handleChange: (emblem: IGuildEmblem) => void;
}
export const BackgroundOptions: React.FC<IBackgroundOptionsProps> = ({ emblem, handleChange }) => {
  const [showBgPicker, setShowBgPicker] = React.useState(false);

  const setBackgroundId = (background_id: number) => handleChange({ background_id });

  const handleBgChange = (background_id: number) => {
    setShowBgPicker(!showBgPicker);
    setBackgroundId(background_id);
  };

  const handlePrevBg = () => {
    let id = emblem.background_id ? emblem.background_id - 1 : maxBackgroundId;
    if (id < minBackgroundId) {
      id = maxBackgroundId;
    }
    return setBackgroundId(id);
  };

  const handleNextBg = () => {
    let id = emblem.background_id ? emblem.background_id + 1 : minBackgroundId;
    if (id > maxBackgroundId) {
      id = minBackgroundId;
    }
    return setBackgroundId(id);
  };

  const handleRandomBg = () => {
    let id = random(minBackgroundId, maxBackgroundId);
    return setBackgroundId(id);
  };

  return (
    <LayerOptions>
      <h3>Background</h3>
      <LayerPreview
        url={emblem.background_id ? getBgUrl(emblem, EMBLEM_SWATCH_SIZE) : null}
        size={EMBLEM_SWATCH_SIZE}
        onClick={() => setShowBgPicker(!showBgPicker)}
        onPrev={handlePrevBg}
        onNext={handleNextBg}
        onClear={() => handleChange({ background_id: undefined })}
        onRandom={handleRandomBg}
      />
      {showBgPicker && (
        <BgPicker emblem={emblem} onChange={handleBgChange} onClose={() => setShowBgPicker(!showBgPicker)} />
      )}
      <FlagToggle
        label={`Flip Horizontal`}
        isEnabled={!!emblem.flags_flip_bg_horizontal}
        onClick={() => handleChange({ flags_flip_bg_horizontal: !emblem.flags_flip_bg_horizontal })}
      />
      <FlagToggle
        label={`Flip Vertical`}
        isEnabled={!!emblem.flags_flip_bg_vertical}
        onClick={() => handleChange({ flags_flip_bg_vertical: !emblem.flags_flip_bg_vertical })}
      />
      {/* <FlagToggle
        label={`Shadow`}
        isEnabled={!!emblem.flags_bg_shadow}
        onClick={() => handleChange({ flags_bg_shadow: !emblem.flags_bg_shadow })}
      /> */}
      <ColorSelection
        emblem={emblem}
        title="Select Background Color"
        colorKey="background_color_id"
        currentColor={colorsById[emblem.background_color_id ?? DEFAULT_BG_COLORID]}
        onClick={(id: number) => handleChange({ background_color_id: id })}
      />
    </LayerOptions>
  );
};

interface IBgPickerProps {
  emblem: IGuildEmblem;
  onChange: (id: number) => void;
  onClose: () => void;
}
const BgPicker: React.FC<IBgPickerProps> = ({ onChange, onClose, emblem }) => {
  return (
    <PickerDialog
      title={
        <div className="flex flex-auto flex-row justify-between">
          <div>Select Background</div>
          <div>
            <EmblemSVG
              emblem={{ ...emblem, foreground_id: undefined, size: 32 }}
              onClick={onClose}
              className="cursor-pointer"
            />
          </div>
        </div>
      }
      onClose={onClose}
    >
      {backgroundIds.map((background_id) => {
        const emblemParams = { ...emblem, background_id, size: Number(EMBLEM_SWATCH_SIZE) };

        return (
          <li
            key={background_id}
            className="block cursor-pointer rounded-md hover:bg-zinc-50 hover:shadow-md"
            onClick={() => onChange(background_id)}
          >
            <EmblemSVG emblem={emblemParams} />
          </li>
        );
      })}
    </PickerDialog>
  );
};
