// pages/agentlogin/agentlogin.js — "Account sign-in": link THIS WeChat to a Landlink account once, with the account's email or phone number and
// password; from then on opening the mini program signs this WeChat in as that account (POST /auth/wechat/bind-agent; the password only proves the
// account and is never stored here). Deliberately neutral wording: nothing here says which kind of account may use it.
const config = require('../../config')

const EN = config.language === 'en'
const MESSAGES = {
  invalid_login: EN ? 'Wrong email / phone number or password' : '邮箱/手机号或密码错误',
  not_eligible: EN ? 'This account cannot be used here' : '此账号暂时无法在这里使用',
  gate: EN ? 'This account needs a step finished on the website first' : '此账号需要先在网页端完成设置',
  disabled: EN ? 'This account is not available' : '该账号暂不可用',
  failed: EN ? 'Could not sign in, please try again later' : '登录失败，请稍后重试'
}

Page({
  data: {
    en: EN,
    identifier: '',
    password: '',
    loading: false,
    error: ''
  },

  onIdentifier(e) { this.setData({ identifier: e.detail.value, error: '' }) },
  onPassword(e) { this.setData({ password: e.detail.value, error: '' }) },

  submit() {
    const { identifier, password, loading } = this.data
    if (loading) return
    if (!identifier.trim() || !password) return this.setData({ error: EN ? 'Enter your email or phone number and password' : '请输入邮箱或手机号和密码' })
    this.setData({ loading: true, error: '' })
    // a fresh wx.login code identifies this WeChat to the server
    wx.login({
      success: (res) => this.bind(res.code),
      fail: () => this.setData({ loading: false, error: MESSAGES.failed })
    })
  },

  bind(code) {
    wx.request({
      url: config.PublicIPCallApiGoBackend + '/auth/wechat/bind-agent',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: { code, identifier: this.data.identifier.trim(), password: this.data.password },
      success: (res) => {
        const d = res.data || {}
        if (res.statusCode !== 200 || !d.token) {
          // trace_id lets support find the exact request in the server's log
          const trace = d.trace_id ? '\n(' + d.trace_id + ')' : ''
          return this.setData({ error: (MESSAGES[d.code] || MESSAGES.failed) + (d.code === 'failed' ? trace : '') })
        }
        // the agent session replaces the customer one; the other pages read it from storage
        wx.setStorageSync('usersdetail', { token: d.token, firstname: d.firstname, lastname: d.lastname, picture: d.picture, level: d.level, role: d.role })
        this.setData({ password: '' })
        wx.showToast({ title: EN ? 'Signed in' : '登录成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 700)
      },
      fail: () => this.setData({ error: MESSAGES.failed }),
      complete: () => this.setData({ loading: false })
    })
  }
})
