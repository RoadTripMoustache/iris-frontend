import { ref, computed } from 'vue'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { signInWithEmailAndPassword, signOut as fbSignOut, signInWithPopup, GoogleAuthProvider, getIdTokenResult } from 'firebase/auth'

type UserInfo = { uid: string; email: string | null; isAdmin: boolean }

export function useAuth() {
    const auth = useFirebaseAuth()
    const firebaseUser = useCurrentUser()

    const currentUserInfo = ref<UserInfo | null>(null)
    const loading = ref(true)

    const user = computed(() => currentUserInfo.value)
    const isAdmin = computed(() => currentUserInfo.value?.isAdmin === true)

    // Surveiller les changements de l'utilisateur Firebase (seulement côté client)
    if (process.client && auth) {
        watch(firebaseUser, async (u) => {
            if (u) {
                const tokenResult = await getIdTokenResult(u)
                const isAdminClaim = tokenResult.claims['admin'] === true
                currentUserInfo.value = { uid: u.uid, email: u.email, isAdmin: isAdminClaim }
            } else {
                currentUserInfo.value = null
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
    }

    async function signInWithGoogle() {
        if (!auth) throw new Error('Auth non disponible')
        const googleProvider = new GoogleAuthProvider()
        await signInWithPopup(auth, googleProvider)
    }

    async function signOut() {
        if (!auth) throw new Error('Auth non disponible')
        await fbSignOut(auth)
    }

    async function getIdToken(): Promise<string | null> {
        if (!auth || !auth.currentUser) return null
        return await auth.currentUser.getIdToken()
    }

    return { user, isAdmin, loading, signInWithEmail, signInWithGoogle, signOut, getIdToken }
}