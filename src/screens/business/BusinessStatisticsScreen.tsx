import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from '../../api/axios';

interface BusinessStats {
  messagesTotal: number;
  messagesSent: number;
  messagesReceived: number;
  activeChats: number;
  newChats: number;
  responseRate: number;
  avgResponseTime: number;
  peakHours: number[];
  topContacts: Array<{
    username: string;
    messageCount: number;
  }>;
}

export const BusinessStatisticsScreen = () => {
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/business/statistics', {
        params: { period },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatResponseTime = (minutes: number): string => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.round(minutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📊</Text>
        <Text style={styles.headerText}>Business Statistics</Text>
        <Text style={styles.headerSubText}>Last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.messagesTotal}</Text>
          <Text style={styles.statLabel}>Total Messages</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.messagesSent}</Text>
          <Text style={styles.statLabel}>Sent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.messagesReceived}</Text>
          <Text style={styles.statLabel}>Received</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeChats}</Text>
          <Text style={styles.statLabel}>Active Chats</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Metrics</Text>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Response Rate</Text>
          <Text style={styles.metricValue}>{stats.responseRate}%</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Avg Response Time</Text>
          <Text style={styles.metricValue}>{formatResponseTime(stats.avgResponseTime)}</Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>New Chats</Text>
          <Text style={styles.metricValue}>{stats.newChats}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Peak Hours</Text>
        <View style={styles.hoursGrid}>
          {[0, 6, 12, 18].map((hour) => (
            <View key={hour} style={styles.hourItem}>
              <Text style={styles.hourLabel}>
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </Text>
              <View style={styles.hourBar}>
                <View
                  style={[
                    styles.hourBarFill,
                    { width: `${(stats.peakHours[hour] || 0) * 10}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Contacts</Text>
        {stats.topContacts.slice(0, 5).map((contact, index) => (
          <View key={index} style={styles.contactItem}>
            <View style={styles.contactLeft}>
              <Text style={styles.contactRank}>#{index + 1}</Text>
              <Text style={styles.contactName}>{contact.username}</Text>
            </View>
            <Text style={styles.contactCount}>{contact.messageCount} messages</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📈 Insights</Text>
        <Text style={styles.infoText}>
          • Respond faster to improve customer satisfaction{'\n'}
          • Peak hours show when customers are most active{'\n'}
          • Track trends to optimize your availability{'\n'}
          • Use quick replies for common questions
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '48%',
    margin: '1%',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#25D366',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  metricLabel: {
    fontSize: 16,
    color: '#333',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#25D366',
  },
  hoursGrid: {
    paddingHorizontal: 16,
  },
  hourItem: {
    marginBottom: 12,
  },
  hourLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hourBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  hourBarFill: {
    height: '100%',
    backgroundColor: '#25D366',
    borderRadius: 4,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25D366',
    marginRight: 12,
  },
  contactName: {
    fontSize: 16,
    color: '#333',
  },
  contactCount: {
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
    lineHeight: 22,
  },
});
