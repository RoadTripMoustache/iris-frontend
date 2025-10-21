import { ref, computed, onMounted } from 'vue'
import { signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged, signInWithPopup, getIdTokenResult } from 'firebase/auth'

type UserInfo = { uid: string; email: string | null; isAdmin: boolean }

const currentUser = ref<UserInfo | null>(null)
const loading = ref(true)

export function useAuth() {
  const { $firebaseAuth, $googleProvider } = useNuxtApp() as any

  const user = computed(() => currentUser.value)
  const isAdmin = computed(() => currentUser.value?.isAdmin === true)

  const ensureListener = () => {
    const started = useState<boolean>('auth-listener-started', () => false)
    if (started.value) return
    started.value = true
    onAuthStateChanged($firebaseAuth, async (u) => {
      if (u) {
        const tokenResult = await getIdTokenResult(u)
        const isAdminClaim = tokenResult.claims['admin'] === true
        currentUser.value = { uid: u.uid, email: u.email, isAdmin: isAdminClaim }
      } else {
        currentUser.value = null
      }
      loading.value = false
    })
  }

  onMounted(ensureListener)

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword($firebaseAuth, email, password)
  }
  async function signInWithGoogle() {
    await signInWithPopup($firebaseAuth, $googleProvider)
  }
  async function signOut() {
    await fbSignOut($firebaseAuth)
  }
  async function getIdToken(): Promise<string | null> {
    const u = $firebaseAuth.currentUser
    if (!u) return null
    return await u.getIdToken()
  }

  return { user, isAdmin, loading, signInWithEmail, signInWithGoogle, signOut, getIdToken }
}
