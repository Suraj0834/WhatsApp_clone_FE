import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: 1,
        title: 'Fast, simple, secure',
        description: 'Message your friends and family for free. WhatsApp uses your phone\'s Internet connection.',
        image: require('../../assets/images/onboarding1.png'),
    },
    {
        id: 2,
        title: 'Stay connected',
        description: 'Send photos, videos, documents, and voice messages. Make voice and video calls.',
        image: require('../../assets/images/onboarding2.png'),
    },
    {
        id: 3,
        title: 'Express yourself',
        description: 'Share moments through Status, send stickers, and use emojis to bring your conversations to life.',
        image: require('../../assets/images/onboarding3.png'),
    },
];

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigation.replace('PhoneInput');
        }
    };

    const handleSkip = () => {
        navigation.replace('PhoneInput');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentSlide(slideIndex);
                }}
            >
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <Image source={slide.image} style={styles.image} />
                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={styles.description}>{slide.description}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentSlide === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttons}>
                    {currentSlide < slides.length - 1 && (
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>SKIP</Text>
                        </TouchableOpacity>
                    )}
                    <Button
                        mode="contained"
                        onPress={handleNext}
                        style={styles.nextButton}
                        labelStyle={styles.nextButtonText}
                    >
                        {currentSlide === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    image: {
        width: width * 0.7,
        height: width * 0.7,
        marginBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#075E54',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#667781',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#25D366',
        width: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skipButton: {
        padding: 12,
    },
    skipText: {
        color: '#075E54',
        fontSize: 14,
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#25D366',
        flex: 1,
        marginLeft: 16,
    },
    nextButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
