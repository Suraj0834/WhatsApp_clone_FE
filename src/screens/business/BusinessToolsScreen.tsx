import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const BusinessToolsScreen = () => {
  const navigation = useNavigation();

  const tools = [
    {
      id: 'catalog',
      title: 'Product Catalog',
      description: 'Showcase your products and services',
      icon: '🛍️',
      route: 'BusinessCatalog',
    },
    {
      id: 'quickReplies',
      title: 'Quick Replies',
      description: 'Save and reuse frequent messages',
      icon: '⚡',
      route: 'QuickReplies',
    },
    {
      id: 'labels',
      title: 'Chat Labels',
      description: 'Organize chats with custom labels',
      icon: '🏷️',
      route: 'ChatLabels',
    },
    {
      id: 'autoReply',
      title: 'Away Message',
      description: 'Set automatic replies when busy',
      icon: '🤖',
      route: 'AutoReply',
    },
    {
      id: 'statistics',
      title: 'Business Statistics',
      description: 'View message and engagement stats',
      icon: '📊',
      route: 'BusinessStatistics',
    },
    {
      id: 'profile',
      title: 'Business Profile',
      description: 'Manage your business information',
      icon: '💼',
      route: 'BusinessProfile',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💼</Text>
        <Text style={styles.headerText}>Business Tools</Text>
        <Text style={styles.headerSubText}>Manage your business on WhatsApp</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>✨ WhatsApp Business</Text>
        <Text style={styles.infoText}>
          Powerful tools to connect with customers, showcase products, and grow your business.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Tools</Text>
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolItem}
            onPress={() => navigation.navigate(tool.route as never)}
          >
            <View style={styles.toolLeft}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
              <View style={styles.toolInfo}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.featuresBox}>
        <Text style={styles.featuresTitle}>🎯 Key Features</Text>
        <Text style={styles.featuresText}>
          • Create and share product catalogs{'\n'}
          • Set up automated responses{'\n'}
          • Organize chats with labels{'\n'}
          • Track message statistics{'\n'}
          • Display business hours{'\n'}
          • Add location and website
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#0d47a1',
    lineHeight: 20,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  toolItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  toolLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },
  featuresBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532d',
    marginBottom: 8,
  },
  featuresText: {
    fontSize: 14,
    color: '#14532d',
    lineHeight: 22,
  },
});
