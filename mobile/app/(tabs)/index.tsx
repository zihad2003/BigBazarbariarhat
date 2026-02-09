import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Elevated Essentials</Text>
                <Text style={styles.heroSubtitle}>
                    Premium quality basics designed for the boardroom, the beach, and everywhere in between.
                </Text>
                <View style={styles.heroButtons}>
                    <Link href="/shop?category=men" asChild>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Shop Men</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href="/shop?category=women" asChild>
                        <TouchableOpacity style={styles.buttonOutline}>
                            <Text style={styles.buttonOutlineText}>Shop Women</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categories}>
                <Link href="/shop?category=men" asChild>
                    <TouchableOpacity style={[styles.categoryCard, styles.categoryMen]}>
                        <Text style={styles.categoryTitle}>The Men's Shop</Text>
                        <Text style={styles.categoryLink}>Explore Now →</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/shop?category=women" asChild>
                    <TouchableOpacity style={[styles.categoryCard, styles.categoryWomen]}>
                        <Text style={styles.categoryTitle}>The Women's Shop</Text>
                        <Text style={styles.categoryLink}>Explore Now →</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {/* Featured Products */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={styles.productCard}>
                            <View style={styles.productImage} />
                            <Text style={styles.productBrand}>Big Bazar</Text>
                            <Text style={styles.productName}>Signature Tee</Text>
                            <Text style={styles.productPrice}>৳999</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    hero: {
        backgroundColor: '#1a1a1a',
        padding: 32,
        paddingTop: 60,
        paddingBottom: 60,
        alignItems: 'center',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 16,
    },
    heroSubtitle: {
        color: '#999',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    heroButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 28,
    },
    buttonText: {
        color: '#000',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 1,
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 28,
    },
    buttonOutlineText: {
        color: '#fff',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: 12,
        letterSpacing: 1,
    },
    categories: {
        gap: 1,
    },
    categoryCard: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 200,
    },
    categoryMen: {
        backgroundColor: '#1e3a5f',
    },
    categoryWomen: {
        backgroundColor: '#4a1f2f',
    },
    categoryTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    categoryLink: {
        color: '#fff',
        fontSize: 14,
        opacity: 0.8,
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 20,
        textAlign: 'center',
    },
    productCard: {
        width: 160,
        marginRight: 16,
    },
    productImage: {
        width: 160,
        height: 200,
        backgroundColor: '#f0f0f0',
        marginBottom: 12,
    },
    productBrand: {
        fontSize: 10,
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    productPrice: {
        fontSize: 14,
        marginTop: 4,
    },
});
