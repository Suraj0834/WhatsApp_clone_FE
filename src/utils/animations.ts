import { Animated, Easing } from 'react-native';

/**
 * Animation configurations and helper functions
 */

export const AnimationConfig = {
    // Timing
    duration: {
        instant: 100,
        fast: 200,
        normal: 300,
        slow: 500,
    },
    
    // Easing
    easing: {
        linear: Easing.linear,
        ease: Easing.ease,
        easeIn: Easing.in(Easing.ease),
        easeOut: Easing.out(Easing.ease),
        easeInOut: Easing.inOut(Easing.ease),
        bounce: Easing.bounce,
        elastic: Easing.elastic(1),
    },
};

/**
 * Fade in animation
 */
export function fadeIn(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal,
    toValue: number = 1
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: AnimationConfig.easing.easeOut,
        useNativeDriver: true,
    });
}

/**
 * Fade out animation
 */
export function fadeOut(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal,
    toValue: number = 0
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: AnimationConfig.easing.easeIn,
        useNativeDriver: true,
    });
}

/**
 * Scale animation (bounce in)
 */
export function scaleIn(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal,
    toValue: number = 1
): Animated.CompositeAnimation {
    return Animated.spring(animatedValue, {
        toValue,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
    });
}

/**
 * Scale out animation
 */
export function scaleOut(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.fast,
    toValue: number = 0
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: AnimationConfig.easing.easeIn,
        useNativeDriver: true,
    });
}

/**
 * Slide in from right
 */
export function slideInRight(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        easing: AnimationConfig.easing.easeOut,
        useNativeDriver: true,
    });
}

/**
 * Slide out to right
 */
export function slideOutRight(
    animatedValue: Animated.Value,
    distance: number,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue: distance,
        duration,
        easing: AnimationConfig.easing.easeIn,
        useNativeDriver: true,
    });
}

/**
 * Slide in from left
 */
export function slideInLeft(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        easing: AnimationConfig.easing.easeOut,
        useNativeDriver: true,
    });
}

/**
 * Slide out to left
 */
export function slideOutLeft(
    animatedValue: Animated.Value,
    distance: number,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue: -distance,
        duration,
        easing: AnimationConfig.easing.easeIn,
        useNativeDriver: true,
    });
}

/**
 * Slide in from bottom
 */
export function slideInBottom(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue: 0,
        duration,
        easing: AnimationConfig.easing.easeOut,
        useNativeDriver: true,
    });
}

/**
 * Slide out to bottom
 */
export function slideOutBottom(
    animatedValue: Animated.Value,
    distance: number,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
        toValue: distance,
        duration,
        easing: AnimationConfig.easing.easeIn,
        useNativeDriver: true,
    });
}

/**
 * Rotate animation (360 degrees)
 */
export function rotate(
    animatedValue: Animated.Value,
    duration: number = AnimationConfig.duration.slow,
    loop: boolean = false
): Animated.CompositeAnimation {
    const animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: AnimationConfig.easing.linear,
        useNativeDriver: true,
    });

    if (loop) {
        return Animated.loop(animation);
    }

    return animation;
}

/**
 * Pulse animation (scale up and down)
 */
export function pulse(
    animatedValue: Animated.Value,
    scale: number = 1.1,
    duration: number = AnimationConfig.duration.slow,
    loop: boolean = false
): Animated.CompositeAnimation {
    const animation = Animated.sequence([
        Animated.timing(animatedValue, {
            toValue: scale,
            duration: duration / 2,
            easing: AnimationConfig.easing.easeOut,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration / 2,
            easing: AnimationConfig.easing.easeIn,
            useNativeDriver: true,
        }),
    ]);

    if (loop) {
        return Animated.loop(animation);
    }

    return animation;
}

/**
 * Shake animation (left to right)
 */
export function shake(
    animatedValue: Animated.Value,
    distance: number = 10,
    duration: number = AnimationConfig.duration.fast
): Animated.CompositeAnimation {
    return Animated.sequence([
        Animated.timing(animatedValue, {
            toValue: distance,
            duration: duration / 4,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: -distance,
            duration: duration / 2,
            useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration / 4,
            useNativeDriver: true,
        }),
    ]);
}

/**
 * Bounce animation
 */
export function bounce(
    animatedValue: Animated.Value,
    toValue: number = 1
): Animated.CompositeAnimation {
    return Animated.spring(animatedValue, {
        toValue,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
    });
}

/**
 * Stagger animation for lists
 */
export function staggerIn(
    items: Animated.Value[],
    delay: number = 50,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.stagger(
        delay,
        items.map((item) =>
            Animated.timing(item, {
                toValue: 1,
                duration,
                easing: AnimationConfig.easing.easeOut,
                useNativeDriver: true,
            })
        )
    );
}

/**
 * Parallel fade and scale animation
 */
export function fadeAndScale(
    fadeValue: Animated.Value,
    scaleValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal,
    fadeToValue: number = 1,
    scaleToValue: number = 1
): Animated.CompositeAnimation {
    return Animated.parallel([
        Animated.timing(fadeValue, {
            toValue: fadeToValue,
            duration,
            easing: AnimationConfig.easing.easeOut,
            useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
            toValue: scaleToValue,
            friction: 5,
            tension: 100,
            useNativeDriver: true,
        }),
    ]);
}

/**
 * Message sent animation (fade + slide)
 */
export function messageSentAnimation(
    fadeValue: Animated.Value,
    slideValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.parallel([
        fadeIn(fadeValue, duration),
        slideInBottom(slideValue, duration),
    ]);
}

/**
 * Message received animation (fade + scale)
 */
export function messageReceivedAnimation(
    fadeValue: Animated.Value,
    scaleValue: Animated.Value,
    duration: number = AnimationConfig.duration.normal
): Animated.CompositeAnimation {
    return Animated.parallel([
        fadeIn(fadeValue, duration),
        scaleIn(scaleValue, duration),
    ]);
}

/**
 * Typing indicator animation (dots bouncing)
 */
export function typingIndicatorAnimation(
    dots: [Animated.Value, Animated.Value, Animated.Value]
): Animated.CompositeAnimation {
    const bounceAnimation = (dot: Animated.Value) =>
        Animated.sequence([
            Animated.timing(dot, {
                toValue: -5,
                duration: 200,
                easing: AnimationConfig.easing.easeOut,
                useNativeDriver: true,
            }),
            Animated.timing(dot, {
                toValue: 0,
                duration: 200,
                easing: AnimationConfig.easing.easeIn,
                useNativeDriver: true,
            }),
        ]);

    return Animated.loop(
        Animated.stagger(100, [
            bounceAnimation(dots[0]),
            bounceAnimation(dots[1]),
            bounceAnimation(dots[2]),
        ])
    );
}

/**
 * Navigation screen transition config
 */
export const ScreenTransitionConfig = {
    // Slide from right (default)
    slideFromRight: {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        },
    },
    
    // Fade
    fade: {
        animation: 'timing',
        config: {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        },
    },
    
    // Modal from bottom
    modalFromBottom: {
        animation: 'spring',
        config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
        },
    },
};

/**
 * Create animated interpolation for rotation
 */
export function createRotateInterpolation(animatedValue: Animated.Value) {
    return animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
}

/**
 * Create animated interpolation for opacity fade
 */
export function createOpacityInterpolation(
    animatedValue: Animated.Value,
    inputRange: number[] = [0, 1],
    outputRange: number[] = [0, 1]
) {
    return animatedValue.interpolate({
        inputRange,
        outputRange,
    });
}

/**
 * Create animated interpolation for translate
 */
export function createTranslateInterpolation(
    animatedValue: Animated.Value,
    inputRange: number[] = [0, 1],
    outputRange: number[] = [0, 100]
) {
    return animatedValue.interpolate({
        inputRange,
        outputRange,
    });
}
