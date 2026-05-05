import { Audio } from 'expo-av';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

// Timing constants — adjust here to tune the whole sequence.
const TIMING = {
  // Stage 1: "The A Team" signature
  signatureRiseFrom: 30, // px below center
  signatureRiseIn: 600, // ms to rise + fade in
  signatureHold: 500, // ms to hold in place
  signatureFadeOut: 400, // ms to fade out
  // Stage 2: Elevate Retail logo
  logoDelay: 100, // ms pause between signature out and logo in
  logoRiseFrom: 30,
  logoRiseIn: 600,
  logoHold: 500,
  logoFadeOut: 400,
  // Stage 3: hand off to app
  handoffDelay: 100, // small buffer before calling onFinish
};

const DERIVED = {
  logoStartsAt:
    TIMING.signatureRiseIn +
    TIMING.signatureHold +
    TIMING.signatureFadeOut +
    TIMING.logoDelay,
  totalDuration: 0, // computed below
};
DERIVED.totalDuration =
  DERIVED.logoStartsAt +
  TIMING.logoRiseIn +
  TIMING.logoHold +
  TIMING.logoFadeOut +
  TIMING.handoffDelay;

type AnimatedSplashProps = {
  /** Called once the full animation sequence completes. */
  onFinish: () => void;
};

/**
 * Two-stage animated splash screen.
 *
 * Stage 1 — "The A" / "Team" text rises from below center, holds, fades.
 * Stage 2 — Elevate Retail logo rises from below center, holds, fades.
 * Stage 3 — Fires onFinish so the parent layout can render the app.
 *
 * Rendered on a white background. Uses StyleSheet.absoluteFillObject so
 * it overlays whatever is rendered underneath, regardless of parent layout.
 */
export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const signatureOpacity = useSharedValue(0);
  const signatureTranslateY = useSharedValue(TIMING.signatureRiseFrom);
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(TIMING.logoRiseFrom);

  useEffect(() => {
    // Stage 1 — signature rises and fades in, holds, fades out.
    let sound: Audio.Sound | undefined;
    const playSound = async () => {
      try {
        const { sound: playbackObject } = await Audio.Sound.createAsync(
          require('@/assets/sounds/SplashJingle.wav')
        );
        sound = playbackObject;
        await sound.playAsync();
      } catch (error) {
        console.log('Sound error:', error);
      }
    };

  playSound();
    signatureOpacity.value = withSequence(
      withTiming(1, {
        duration: TIMING.signatureRiseIn,
        easing: Easing.out(Easing.cubic),
      }),
      withDelay(
        TIMING.signatureHold,
        withTiming(0, {
          duration: TIMING.signatureFadeOut,
          easing: Easing.in(Easing.cubic),
        }),
      ),
    );
    signatureTranslateY.value = withTiming(0, {
      duration: TIMING.signatureRiseIn,
      easing: Easing.out(Easing.cubic),
    });

    // Stage 2 — logo rises and fades in after the signature is gone.
    logoOpacity.value = withDelay(
      DERIVED.logoStartsAt,
      withSequence(
        withTiming(1, {
          duration: TIMING.logoRiseIn,
          easing: Easing.out(Easing.cubic),
        }),
        withDelay(
          TIMING.logoHold,
          withTiming(0, {
            duration: TIMING.logoFadeOut,
            easing: Easing.in(Easing.cubic),
          }),
        ),
      ),
    );
    logoTranslateY.value = withDelay(
      DERIVED.logoStartsAt,
      withTiming(0, {
        duration: TIMING.logoRiseIn,
        easing: Easing.out(Easing.cubic),
      }),
    );

    // Stage 3 — hand off to the app once everything is done.
    const timeoutId = setTimeout(() => {
      onFinish();
    }, DERIVED.totalDuration);

    return () => {
      clearTimeout(timeoutId);
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signatureAnimatedStyle = useAnimatedStyle(() => ({
    opacity: signatureOpacity.value,
    transform: [{ translateY: signatureTranslateY.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  return (
    <View style={styles.container} pointerEvents='none'>
      <Animated.View style={[styles.centerOverlay, signatureAnimatedStyle]}>
        <Text style={styles.signatureLine}>The A</Text>
        <Text style={styles.signatureLine}>Team</Text>
      </Animated.View>

      <Animated.View style={[styles.centerOverlay, logoAnimatedStyle]}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          resizeMode='contain'
        />
      </Animated.View>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_SIZE = Math.min(SCREEN_WIDTH * 0.6, 280);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureLine: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 52,
    letterSpacing: 0.5,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
