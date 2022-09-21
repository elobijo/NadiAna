import React from 'react';
import {Path} from 'react-native-svg';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const ForwardIcon = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.357 24.976a.617.617 0 0 1-.425-.764c.676-2.351.917-4.806.708-7.243l-.201-1.566a24.167 24.167 0 0 1-2.603.002c-1.657-.09-3.776-.392-5.325-1.3-2.087-1.218-3.173-2.71-3.444-4.25-.269-1.531.293-2.979 1.237-4.06C4.194 4.768 5.61 3.999 7.194 4c1.613.002 3.304.803 4.716 2.737 1 1.365 1.66 3.33 2.069 4.894a29.703 29.703 0 0 1 .53 2.453 102.275 102.275 0 0 0 3.994-.415c2.65-.33 5.742-.834 7.704-1.534a.617.617 0 1 1 .42 1.163c-2.106.751-5.324 1.268-7.97 1.597a103.18 103.18 0 0 1-3.979.414l.195 1.516a21.245 21.245 0 0 1-.748 7.727.621.621 0 0 1-.768.424Zm-.092-10.8-.055-.301a28.455 28.455 0 0 0-.432-1.933c-.403-1.539-1.017-3.311-1.872-4.478-1.218-1.668-2.559-2.227-3.713-2.229-1.182-.002-2.268.58-2.95 1.368l-.002.002c-.752.86-1.143 1.945-.95 3.037.19 1.085.978 2.306 2.849 3.397h.001c1.279.752 3.144 1.044 4.763 1.132a22.94 22.94 0 0 0 2.36.004Z"
      fill={fill}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.652 18.215c-.255-.198-.333-.615-.174-.933l2.24-4.467-3.296-2.806c-.248-.211-.311-.633-.142-.941.17-.31.51-.388.757-.177l3.726 3.173c.24.205.309.61.154.917L25.402 18c-.159.318-.495.415-.75.216Z"
      fill={fill}
    />
  </Icon>
);
