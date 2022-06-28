import { random } from 'lodash';
import React from 'react';
import { MdSwapHoriz, MdSwapVert } from 'react-icons/md';
import {
  colorsById,
  DEFAULT_FG_PRIMARY_COLORID,
  DEFAULT_FG_SECONDARY_COLORID,
  EMBLEM_SWATCH_SIZE,
  foregroundIds,
  maxForegroundId,
  minForegroundId,
} from '~/lib/emblem/constants';
import { getEmblemUrl, getFgUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';
import { ColorSelection } from './colors';
import { FlagToggle, LayerOptions, LayerPreview, PickerDialog } from './utils';

interface IForegroundOptionsProps {
  emblem: IGuildEmblem;
  handleChange: (emblem: IGuildEmblem) => void;
}
export const ForegroundOptions: React.FC<IForegroundOptionsProps> = ({ emblem, handleChange }) => {
  const [showFgPicker, setShowFgPicker] = React.useState(false);

  const setForegroundId = (foreground_id: number) => handleChange({ foreground_id });

  const handleFgChange = (foreground_id: number) => {
    setShowFgPicker(!showFgPicker);
    handleChange({ foreground_id });
  };

  const handlePrevFg = () => {
    let id = emblem.foreground_id ? emblem.foreground_id - 1 : maxForegroundId;
    if (id < minForegroundId) {
      id = maxForegroundId;
    }
    return setForegroundId(id);
  };

  const handleNextFg = () => {
    let id = emblem.foreground_id ? emblem.foreground_id + 1 : minForegroundId;
    if (id > maxForegroundId) {
      id = minForegroundId;
    }
    return setForegroundId(id);
  };

  const handleRandomFg = () => {
    let id = random(minForegroundId, maxForegroundId);
    return setForegroundId(id);
  };

  return (
    <LayerOptions>
      <h3>Foreground</h3>
      <LayerPreview
        url={emblem.foreground_id ? getFgUrl(emblem, EMBLEM_SWATCH_SIZE) : null}
        size={EMBLEM_SWATCH_SIZE}
        onClick={() => setShowFgPicker(!showFgPicker)}
        onPrev={handlePrevFg}
        onNext={handleNextFg}
        onClear={() => handleChange({ foreground_id: undefined })}
        onRandom={handleRandomFg}
      />
      {showFgPicker && (
        <FgPicker
          title="Select Foreground"
          emblem={emblem}
          onChange={handleFgChange}
          onClose={() => setShowFgPicker(!showFgPicker)}
        />
      )}
      <FlagToggle
        icon={<MdSwapHoriz />}
        label={`Flip Horizontal`}
        isEnabled={!!emblem.flags_flip_fg_horizontal}
        onClick={() => handleChange({ flags_flip_fg_horizontal: !emblem.flags_flip_fg_horizontal })}
      />
      <FlagToggle
        icon={<MdSwapVert />}
        label={`Flip Vertical`}
        isEnabled={!!emblem.flags_flip_fg_vertical}
        onClick={() => handleChange({ flags_flip_fg_vertical: !emblem.flags_flip_fg_vertical })}
      />
      <ColorSelection
        emblem={emblem}
        title="Select Foreground Primary Color"
        colorKey="foreground_primary_color_id"
        currentColor={colorsById[emblem.foreground_primary_color_id ?? DEFAULT_FG_PRIMARY_COLORID]}
        onClick={(id: number) => handleChange({ foreground_primary_color_id: id })}
      />
      <ColorSelection
        emblem={emblem}
        title="Select Foreground Secondary Color"
        colorKey="foreground_secondary_color_id"
        currentColor={colorsById[emblem.foreground_secondary_color_id ?? DEFAULT_FG_SECONDARY_COLORID]}
        onClick={(id: number) => handleChange({ foreground_secondary_color_id: id })}
      />
    </LayerOptions>
  );
};

interface IFgPickerProps {
  title: string;
  emblem: IGuildEmblem;
  onChange: (id: number) => void;
  onClose: () => void;
}
const FgPicker: React.FC<IFgPickerProps> = ({ onChange, onClose, emblem, title }) => {
  return (
    <PickerDialog title={title} onClose={onClose}>
      {foregroundIds.map((foreground_id) => {
        const emblemParams = { ...emblem, foreground_id };
        const emblemUrl = getEmblemUrl(emblemParams, EMBLEM_SWATCH_SIZE);

        return (
          <li
            key={foreground_id}
            className="block cursor-pointer rounded-md p-1 hover:bg-zinc-200 hover:shadow-md"
            onClick={() => onChange(foreground_id)}
          >
            <img src={emblemUrl} width={EMBLEM_SWATCH_SIZE} height={EMBLEM_SWATCH_SIZE} defaultValue="" />
          </li>
        );
      })}
    </PickerDialog>
  );
};
