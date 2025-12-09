import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Searchbar, Avatar, FAB } from 'react-native-paper';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    category: string;
    inStock: boolean;
}

interface Category {
    id: string;
    name: string;
    count: number;
}

export const CatalogScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories: Category[] = [
        { id: 'all', name: 'All', count: 12 },
        { id: 'electronics', name: 'Electronics', count: 5 },
        { id: 'clothing', name: 'Clothing', count: 4 },
        { id: 'accessories', name: 'Accessories', count: 3 },
    ];

    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            name: 'Wireless Headphones',
            description: 'Premium noise-canceling headphones with 30-hour battery',
            price: 299.99,
            currency: '$',
            image: '🎧',
            category: 'electronics',
            inStock: true,
        },
        {
            id: '2',
            name: 'Smartphone Case',
            description: 'Protective case with built-in kickstand',
            price: 29.99,
            currency: '$',
            image: '📱',
            category: 'accessories',
            inStock: true,
        },
        {
            id: '3',
            name: 'Cotton T-Shirt',
            description: 'Soft, breathable, 100% organic cotton',
            price: 24.99,
            currency: '$',
            image: '👕',
            category: 'clothing',
            inStock: false,
        },
        {
            id: '4',
            name: 'Laptop Stand',
            description: 'Adjustable aluminum laptop stand for better ergonomics',
            price: 49.99,
            currency: '$',
            image: '💻',
            category: 'electronics',
            inStock: true,
        },
        {
            id: '5',
            name: 'Leather Wallet',
            description: 'Genuine leather bifold wallet with RFID protection',
            price: 39.99,
            currency: '$',
            image: '👛',
            category: 'accessories',
            inStock: true,
        },
        {
            id: '6',
            name: 'Running Shoes',
            description: 'Lightweight running shoes with cushioned sole',
            price: 89.99,
            currency: '$',
            image: '👟',
            category: 'clothing',
            inStock: true,
        },
        {
            id: '7',
            name: 'Wireless Mouse',
            description: 'Ergonomic wireless mouse with precision tracking',
            price: 34.99,
            currency: '$',
            image: '🖱️',
            category: 'electronics',
            inStock: true,
        },
        {
            id: '8',
            name: 'Sunglasses',
            description: 'UV protection sunglasses with polarized lenses',
            price: 79.99,
            currency: '$',
            image: '🕶️',
            category: 'accessories',
            inStock: false,
        },
        {
            id: '9',
            name: 'Denim Jacket',
            description: 'Classic denim jacket with modern fit',
            price: 69.99,
            currency: '$',
            image: '🧥',
            category: 'clothing',
            inStock: true,
        },
        {
            id: '10',
            name: 'USB-C Hub',
            description: '7-in-1 USB-C hub with HDMI and card reader',
            price: 44.99,
            currency: '$',
            image: '🔌',
            category: 'electronics',
            inStock: true,
        },
        {
            id: '11',
            name: 'Baseball Cap',
            description: 'Adjustable cotton baseball cap',
            price: 19.99,
            currency: '$',
            image: '🧢',
            category: 'clothing',
            inStock: true,
        },
        {
            id: '12',
            name: 'Bluetooth Speaker',
            description: 'Portable waterproof speaker with 12-hour battery',
            price: 59.99,
            currency: '$',
            image: '🔊',
            category: 'electronics',
            inStock: true,
        },
    ]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleProductPress = (product: Product) => {
        Alert.alert(
            product.name,
            `${product.description}\n\nPrice: ${product.currency}${product.price}\nStatus: ${
                product.inStock ? 'In Stock' : 'Out of Stock'
            }`,
            [
                { text: 'Close' },
                {
                    text: product.inStock ? 'Share Product' : 'Notify When Available',
                    onPress: () => {
                        if (product.inStock) {
                            Alert.alert('Success', `Shared ${product.name}`);
                        } else {
                            Alert.alert('Success', 'You\'ll be notified when available');
                        }
                    },
                },
            ]
        );
    };

    const handleEditProduct = (productId: string) => {
        Alert.alert('Edit Product', 'Edit product details', [{ text: 'OK' }]);
    };

    const handleDeleteProduct = (productId: string) => {
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        Alert.alert(
            'Delete Product',
            `Remove ${product.name} from catalog?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setProducts(products.filter((p) => p.id !== productId));
                        Alert.alert('Success', 'Product removed from catalog');
                    },
                },
            ]
        );
    };

    const handleAddProduct = () => {
        Alert.alert(
            'Add Product',
            'Add a new product to your catalog',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Add', onPress: () => {} },
            ]
        );
    };

    const renderProduct = ({ item }: { item: Product }) => {
        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => handleProductPress(item)}
                onLongPress={() => {
                    Alert.alert(
                        item.name,
                        'Choose an action',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Edit', onPress: () => handleEditProduct(item.id) },
                            {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => handleDeleteProduct(item.id),
                            },
                        ]
                    );
                }}
            >
                <View style={styles.productImage}>
                    <Text style={styles.productImageText}>{item.image}</Text>
                </View>
                <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                        <Text style={styles.productName} numberOfLines={1}>
                            {item.name}
                        </Text>
                        {!item.inStock && (
                            <View style={styles.outOfStockBadge}>
                                <Text style={styles.outOfStockText}>Out of Stock</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.productDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                    <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>
                            {item.currency}
                            {item.price.toFixed(2)}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.shareButton,
                                !item.inStock && styles.shareButtonDisabled,
                            ]}
                            onPress={() => {
                                if (item.inStock) {
                                    Alert.alert('Success', `Shared ${item.name}`);
                                }
                            }}
                            disabled={!item.inStock}
                        >
                            <Text style={styles.shareButtonText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderCategoryChip = (category: Category) => {
        const isSelected = selectedCategory === category.id;
        return (
            <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                onPress={() => setSelectedCategory(category.id)}
            >
                <Text
                    style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                    ]}
                >
                    {category.name} ({category.count})
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Product Catalog</Text>
                <Text style={styles.headerSubtitle}>
                    Manage and share your products
                </Text>
            </View>

            <Searchbar
                placeholder="Search products"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchbar}
            />

            <View style={styles.categories}>
                {categories.map(renderCategoryChip)}
            </View>

            <FlatList
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
                columnWrapperStyle={styles.columnWrapper}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateIcon}>📦</Text>
                        <Text style={styles.emptyStateText}>No products found</Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={handleAddProduct}
                color="#fff"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        backgroundColor: '#F7F8FA',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#667781',
    },
    searchbar: {
        marginHorizontal: 16,
        marginVertical: 16,
        backgroundColor: '#F7F8FA',
    },
    categories: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 12,
        flexWrap: 'wrap',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F7F8FA',
        marginRight: 8,
        marginBottom: 8,
    },
    categoryChipSelected: {
        backgroundColor: '#25D366',
    },
    categoryChipText: {
        fontSize: 14,
        color: '#667781',
        fontWeight: '600',
    },
    categoryChipTextSelected: {
        color: '#fff',
    },
    list: {
        paddingHorizontal: 8,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        marginHorizontal: 8,
        marginBottom: 16,
        backgroundColor: '#F7F8FA',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    productImage: {
        height: 120,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImageText: {
        fontSize: 48,
    },
    productInfo: {
        padding: 12,
    },
    productHeader: {
        marginBottom: 4,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    outOfStockBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFE0E0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 2,
    },
    outOfStockText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#F44336',
    },
    productDescription: {
        fontSize: 13,
        color: '#667781',
        marginBottom: 8,
        lineHeight: 18,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#25D366',
    },
    shareButton: {
        backgroundColor: '#25D366',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    shareButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    shareButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#667781',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#25D366',
    },
});
