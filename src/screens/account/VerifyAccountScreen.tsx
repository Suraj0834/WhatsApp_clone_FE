import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from '../../api/axios';

export const VerifyAccountScreen = () => {
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
      });

      if (result.assets && result.assets.length > 0) {
        setDocuments([...documents, ...result.assets]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const submitVerification = async () => {
    if (!businessName || !businessCategory) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (documents.length === 0) {
      Alert.alert('Error', 'Please upload at least one verification document');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('businessName', businessName);
      formData.append('businessCategory', businessCategory);
      formData.append('businessWebsite', businessWebsite);
      formData.append('businessPhone', businessPhone);

      documents.forEach((doc, index) => {
        formData.append(`document_${index}`, {
          uri: doc.uri,
          type: doc.mimeType,
          name: doc.name,
        } as any);
      });

      await axios.post('/users/account/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert(
        'Verification Submitted',
        'Your verification request has been submitted. We\'ll review it and get back to you within 3-5 business days.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>✓</Text>
        <Text style={styles.headerText}>Verify Your Account</Text>
        <Text style={styles.headerSubText}>
          Get the blue checkmark badge for your business
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        
        <Text style={styles.label}>Business Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Business Name"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Restaurant, Retail, Services"
          value={businessCategory}
          onChangeText={setBusinessCategory}
        />

        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          placeholder="https://yourbusiness.com"
          value={businessWebsite}
          onChangeText={setBusinessWebsite}
          keyboardType="url"
        />

        <Text style={styles.label}>Business Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="+1 (555) 123-4567"
          value={businessPhone}
          onChangeText={setBusinessPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Verification Documents</Text>
        <Text style={styles.documentsDescription}>
          Upload official business documents (business license, tax ID, etc.)
        </Text>

        {documents.map((doc, index) => (
          <View key={index} style={styles.documentItem}>
            <Text style={styles.documentName}>{doc.name}</Text>
            <TouchableOpacity onPress={() => removeDocument(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Text style={styles.uploadButtonText}>+ Add Document</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Why verify?</Text>
        <Text style={styles.infoText}>
          ✓ Blue checkmark badge{'\n'}
          ✓ Increased customer trust{'\n'}
          ✓ Access to business features{'\n'}
          ✓ Appear in business directory
        </Text>
      </View>

      <View style={styles.requirementsBox}>
        <Text style={styles.requirementsTitle}>Requirements</Text>
        <Text style={styles.requirementsText}>
          • Must be a legitimate business{'\n'}
          • Provide valid business documents{'\n'}
          • Match business name on documents{'\n'}
          • Active business operations
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.buttonDisabled]}
        onPress={submitVerification}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit for Verification</Text>
        )}
      </TouchableOpacity>
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
    fontSize: 64,
    color: '#25D366',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  headerSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  documentsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '600',
  },
  uploadButton: {
    padding: 16,
    borderWidth: 2,
    borderColor: '#25D366',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#25D366',
    fontWeight: '600',
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
  requirementsBox: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e65100',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: '#e65100',
    lineHeight: 22,
  },
  submitButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#25D366',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
