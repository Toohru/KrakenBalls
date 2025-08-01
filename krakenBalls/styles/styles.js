import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    // Existing styles
    // Page & Layout
    pageWrapper: {
        flex: 1,
        padding: 0,
        backgroundColor: '#0a0a0a',
    },
    
    // Plan Name Input
    planNameContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    planNameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    
    // Header Actions
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Typography
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    
    // Exercise List
    exerciseList: {
        paddingBottom: 24,
    },

    // Exercise Name Input
    exerciseNameContainer: {
        marginBottom: 16,
        paddingHorizontal: 16,
        marginTop: 8,
    },
    exerciseNameInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    
    // Exercise Item
    exerciseItem: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    exerciseInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        marginRight: 12,
        flexWrap: 'wrap',
    },
    exerciseDescription: {
        fontSize: 13,
        color: '#888',
        marginTop: 4,
        flex: 1,
    },
    exerciseTypeContainer: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    // Buttons
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4a90e2',
        paddingVertical: 14,
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },

    // Plan Card
    planCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        overflow: 'hidden',
        flex: 1,
        width: '90%',
    },
    planContent: {
        flex: 1,
        padding: 16,
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    planMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    planDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    planDetailText: {
        color: '#888',
        fontSize: 13,
        marginLeft: 4,
    },
    planDate: {
        color: '#666',
        fontSize: 12,
    },
    deleteButton: {
        padding: 16,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planContent: {
        flex: 1,
        padding: 16,
    },
    planInfo: {
        flex: 1,
    },
    planName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    planMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    planDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    planDetailText: {
        color: '#888',
        fontSize: 13,
        marginLeft: 4,
    },
    planDate: {
        color: '#666',
        fontSize: 12,
    },
    deleteButton: {
        padding: 16,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Exercise Card
    exerciseCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    exerciseCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    exerciseIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(74, 144, 226, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    exerciseInfo: {
        flex: 1,
        marginRight: 12,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        lineHeight: 22,
    },
    exerciseTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    exerciseTypeIcon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: 4,
        fontSize: 12,
    },
    exerciseType: {
        color: '#888',
        fontSize: 13,
        fontWeight: '500',
        marginTop: 1,
    },
    exerciseActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    exerciseNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    exerciseNumberText: {
        color: '#4a90e2',
        fontWeight: '700',
        fontSize: 14,
    },
    exerciseName: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        padding: 6,
        marginLeft: 8,
    },
    exerciseDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    detailRow: {
        alignItems: 'center',
    },
    detailLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        marginTop: 8,
    },
    editButtonText: {
        color: '#4a90e2',
        marginLeft: 6,
        fontWeight: '600',
        fontSize: 14,
    },
    addExerciseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(74, 144, 226, 0.3)',
        borderStyle: 'dashed',
        marginTop: 8,
    },
    addExerciseButtonText: {
        color: '#4a90e2',
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 16,
    },
    exerciseItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    exerciseName: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        flex: 1,
    },
    exerciseType: {
        color: '#4a90e2',
        fontSize: 13,
        fontWeight: '600',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginLeft: 10,
    },
    setContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    setLabel: {
        color: '#aaa',
        width: 50,
        fontSize: 14,
        fontWeight: '500',
    },

    // Empty State
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyStateText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
        fontSize: 16,
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyStateTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
    },

    // Loading States
    loadingContainer: {
        width: '100%',
        padding: 20,
    },
    loadingCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    loadingLine: {
        height: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 8,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: '#141414',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 40,
        width: '100%',
        maxHeight: height * 0.9,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    closeButton: {
        padding: 8,
        marginRight: -8,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalButton: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginRight: 10,
    },
    addButtonDisabled: {
        opacity: 0.5,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 8,
        paddingLeft: 10,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    },
    exerciseListContent: {
        paddingBottom: 24,
    },
    exerciseListItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 12,
        marginBottom: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    exerciseListItemSelected: {
        backgroundColor: 'rgba(74, 144, 226, 0.15)',
        borderColor: 'rgba(74, 144, 226, 0.3)',
    },
    exerciseListItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    exerciseListItemName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginRight: 12,
    },
    exerciseTypeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    exerciseTypeText: {
        color: '#888',
        fontSize: 12,
        fontWeight: '600',
    },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    checkboxSelected: {
        backgroundColor: '#4a90e2',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    planCard: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    checkboxSelected: {
        backgroundColor: '#4a90e2',
        borderColor: '#4a90e2',
    },
    emptyStateText: {
        color: '#666',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
    },
    // Input container with icon
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        top: 14,
        zIndex: 1,
    },
    charCount: {
        position: 'absolute',
        right: 12,
        bottom: 8,
        fontSize: 12,
        color: '#666',
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        top: 16,
        zIndex: 1,
    },
    // Empty state circle
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 0,
        maxHeight: 'auto',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    modalHeaderContent: {
        flex: 1,
        marginRight: 16,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    modalSubtitle: {
        color: '#888',
        fontSize: 14,
        lineHeight: 20,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        padding: 24,
        paddingTop: 16,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        color: '#ddd',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputWrapper: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    input: {
        color: '#fff',
        fontSize: 16,
        padding: 16,
        height: 52,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginVertical: 20,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
        paddingTop: 8,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        minHeight: 80, // Fixed height for the footer
    },
    modalButton: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: 12,
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        width: '100%',
        maxWidth: 300,
        height: 52, // Fixed height for the button
        borderRadius: 14,
        overflow: 'hidden',
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonIcon: {
        marginRight: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Toggle Switch
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    switchLabel: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    switchSubtitle: {
        color: '#888',
        fontSize: 13,
        fontFamily: 'System',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toggleLabel: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: '500',
    },
    toggleSwitch: {
        width: 60,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 2,
        justifyContent: 'center',
    },
    toggleSwitchActive: {
        backgroundColor: 'rgba(74, 144, 226, 0.3)',
    },
    toggleSwitchTrack: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    toggleSwitchThumb: {
        position: 'absolute',
        top: 2,
        left: 2,
        width: 26,
        height: 26,
        backgroundColor: '#fff',
        borderRadius: 13,
        transform: [{ translateX: 0 }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 2,
        transition: 'transform 0.2s ease-in-out',
    },
    toggleSwitchThumbActive: {
        transform: [{ translateX: 30 }],
    },
    emptyCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Primary button
    primaryButton: {
        backgroundColor: '#4a90e2',
        borderRadius: 14,
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#4a90e2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        width: '100%',
        flexDirection: 'row',
    },
});