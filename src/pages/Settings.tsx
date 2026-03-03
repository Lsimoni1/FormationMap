import { useState } from 'react'
import { ArrowUpLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

type TabId = 'account' | 'preferences'

const TABS: { id: TabId; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'preferences', label: 'Preferences' },
]

const AccountPanel = () => {
  const { user } = useAuth()
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Account</h2>
      <p className="text-sm text-muted-foreground">Email</p>
      <p className="mt-1">{user?.email}</p>
    </div>
  )
}

const PreferencesPanel = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Preferences</h2>
      <div className="flex items-center justify-between">
        <p>Dark mode</p>
        <Button variant="outline" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
      </div>
    </div>
  )
}

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account')

  return (
    <div className='min-h-screen flex flex-col'/* whole page wrapper */>
      <div className='flex pt-8 pl-10' /* back button row */>
        <Button /* back button */
          title="Close Settings Menu"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowUpLeft />
        </Button>
      </div>
      <div className='flex pt-8 px-16 flex-1 pb-8 gap-4' /* content row */>
        <div className='w-30 flex-col flex-stretch divide-y border-2 rounded-md p-2'/* vertical column with tabs/labels */>
          {TABS.map(tab => ( 
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className = {cn('w-full', tab.id === activeTab ? 'bg-accent text-accent-foreground' : '')}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className='flex-1 border-2 rounded-md p-6' /* content section (horizontal) */>
          {(activeTab === 'account' ? <AccountPanel/> : <PreferencesPanel/>)}
        </div>
      </div>
    </div>
  )
}

export default Settings
