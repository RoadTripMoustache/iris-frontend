import { ref, computed } from 'vue'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import { signInWithEmailAndPassword, signOut as fbSignOut, signInWithPopup, GoogleAuthProvider, getIdTokenResult } from 'firebase/auth'

type UserInfo = { uid: string; email: string | null; isAdmin: boolean }

export function useAuth() {
    const auth = useFirebaseAuth()!
    const firebaseUser = useCurrentUser()

    const currentUserInfo = ref<UserInfo | null>(null)
    const loading = ref(true)

    const user = computed(() => currentUserInfo.value)
    const isAdmin = computed(() => currentUserInfo.value?.isAdmin === true)

    // Surveiller les changements de l'utilisateur Firebase
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

    async function signInWithEmail(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password)
    }

    async function signInWithGoogle() {
        const googleProvider = new GoogleAuthProvider()
        await signInWithPopup(auth, googleProvider)
    }

    async function signOut() {
        await fbSignOut(auth)
    }

    async function getIdToken(): Promise<string | null> {
        const u = auth.currentUser
        if (!u) return null
        return await u.getIdToken()
    }

    return { user, isAdmin, loading, signInWithEmail, signInWithGoogle, signOut, getIdToken }
}