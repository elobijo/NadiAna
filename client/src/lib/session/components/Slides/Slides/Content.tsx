import React, {useMemo} from 'react';
import styled from 'styled-components/native';

import {
  ExerciseSlideContentSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';
import Image from '../../../../components/Image/Image';
import Video from './Blocks/Video';
import {Spacer12, Spacer8} from '../../../../components/Spacers/Spacer';
import Text from './Blocks/Text';
import Lottie from './Blocks/Lottie';
import ContentWrapper from '../../ContentWrapper/ContentWrapper';

const GraphicsWrapper = styled.View({
  flex: 1,
});

const TextWrapper = styled.View({
  justifyContent: 'center',
  flex: 1,
});

const VideoWrapper = styled.View({
  flex: 1,
  aspectRatio: '1',
  alignSelf: 'center',
});

type ContentProps = {
  slide:
    | ExerciseSlideContentSlide
    | ExerciseSlideSharingSlide
    | ExerciseSlideReflectionSlide;
  active: boolean;
  async?: boolean;
};
const Content: React.FC<ContentProps> = ({
  slide: {content = {}},
  active,
  async,
}) => {
  const videoSource = useMemo(
    () => ({uri: content?.video?.source}),
    [content.video?.source],
  );

  const audioSource = useMemo(
    () => (content?.video?.audio ? {uri: content.video.audio} : undefined),
    [content?.video?.audio],
  );

  const imageSource = useMemo(
    () => ({uri: content?.image?.source}),
    [content?.image?.source],
  );

  const lottieSource = useMemo(
    () => ({uri: content?.lottie?.source ?? ''}),
    [content?.lottie?.source],
  );

  const lottieAudioSource = useMemo(
    () => (content?.lottie?.audio ? {uri: content.lottie.audio} : undefined),
    [content?.lottie?.audio],
  );

  const lottieDuration = useMemo(
    () => content.lottie?.duration ?? 60,
    [content.lottie?.duration],
  );

  return (
    <ContentWrapper>
      <Spacer12 />
      {!content.video && !content.image && !content.lottie && (
        <TextWrapper>
          {content.heading && <Heading>{content.heading}</Heading>}
          {content.text && <Text>{content.text}</Text>}
        </TextWrapper>
      )}
      {!async &&
        (content.video || content.image || content.lottie) &&
        content.heading && <Heading>{content.heading}</Heading>}
      {!async &&
        (content.video || content.image || content.lottie) &&
        content.text && <Text>{content.text}</Text>}

      {content.lottie ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Lottie
            source={lottieSource}
            audioSource={lottieAudioSource}
            active={active}
            duration={lottieDuration}
            autoPlayLoop={content.lottie.autoPlayLoop}
            durationTimer={content.lottie.durationTimer}
          />
          <Spacer8 />
        </GraphicsWrapper>
      ) : content.video ? (
        <GraphicsWrapper>
          <Spacer8 />
          <VideoWrapper>
            <Video
              source={videoSource}
              audioSource={audioSource}
              active={active}
              preview={content.video.preview}
              autoPlayLoop={content.video.autoPlayLoop}
              durationTimer={content.video.durationTimer}
            />
          </VideoWrapper>
        </GraphicsWrapper>
      ) : content.image ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Image resizeMode="contain" source={imageSource} />
        </GraphicsWrapper>
      ) : null}
    </ContentWrapper>
  );
};

export default React.memo(Content);
