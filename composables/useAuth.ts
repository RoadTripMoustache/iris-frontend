import { ref, computed, watch } from 'vue'
import { useFirebaseAuth, useCurrentUser, getCurrentUser } from 'vuefire'
import { signInWithEmailAndPassword, signOut as fbSignOut, signInWithPopup, GoogleAuthProvider, getIdTokenResult } from 'firebase/auth'

type UserInfo = { uid: string; email: string | null; isAdmin: boolean }

export function useAuth() {
    const auth = useFirebaseAuth()
    const firebaseUser = useCurrentUser()

    const currentUserInfo = ref<UserInfo | null>(null)
    const loading = ref(true)

    const user = computed(() => currentUserInfo.value)
    const isAdmin = ref(false)

    // Surveiller les changements de l'utilisateur Firebase (seulement côté client)
    if (process.client) {
        watch(firebaseUser, async (u) => {
            if (u) {
                try {
                    // On lit toujours les claims, mais on s'appuie sur le backend pour la vérité
                    const tokenResult = await getIdTokenResult(u)
                    const isAdminClaim = tokenResult.claims['admin'] === true
                    currentUserInfo.value = { uid: u.uid, email: u.email, isAdmin: isAdminClaim }
                    await fetchAdminFromBackend()
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur:', error)
                    currentUserInfo.value = null
                    isAdmin.value = false
                }
            } else {
                currentUserInfo.value = null
                isAdmin.value = false
            }
            loading.value = false
        }, { immediate: true })
    } else {
        // Côté serveur, on considère qu'il n'y a pas d'utilisateur
        loading.value = false
    }

    async function signInWithEmail(email: string, password: string) {
        if (!auth) throw new Error('Auth non disponible')
        await signInWithEmailAndPassword(auth, email, password)
        await fetchAdminFromBackend()
    }

    async function signInWithGoogle() {
        if (!auth) throw new Error('Auth non disponible')
        const googleProvider = new GoogleAuthProvider()
        await signInWithPopup(auth, googleProvider)
        await fetchAdminFromBackend()
    }

    async function signOut() {
        if (!auth) throw new Error('Auth non disponible')
        await fbSignOut(auth)
        isAdmin.value = false
    }

    async function getIdToken(forceRefresh = false): Promise<string | null> {
        if (!process.client) {
            return null
        }
        
        // Utiliser firebaseUser.value au lieu de auth.currentUser
        let user = firebaseUser.value
        
        if (!user) {
            try {
                user = await getCurrentUser()
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur courant:', error)
                return null
            }
        }
        
        if (!user) return null
        
        try {
            return await user.getIdToken(forceRefresh)
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error)
            return null
        }
    }

    async function fetchAdminFromBackend() {
        if (!process.client) return
        try {
            const token = await getIdToken()
            if (!token) {
                isAdmin.value = false
                return
            }
            const config = useRuntimeConfig()
            const base = config.public.apiBaseUrl?.replace(/\/$/, '') || ''
            const res = await fetch(`${base}/v1/admin/me`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            })
            if (!res.ok) {
                isAdmin.value = false
                return
            }
            const data = await res.json() as { is_admin?: boolean }
            isAdmin.value = data?.is_admin === true
        } catch (e) {
            console.error('Erreur lors de l\'appel /v1/admin/me:', e)
            isAdmin.value = false
        }
    }

    return { user, isAdmin, loading, signInWithEmail, signInWithGoogle, signOut, getIdToken }
}