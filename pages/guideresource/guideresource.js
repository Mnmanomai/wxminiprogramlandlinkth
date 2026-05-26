const app = getApp();
const config = require("../../config");

Page({
  data: {
    searchVal: '',
    selectedCategory: 'all',
    hasSearched: false,
    isLoading: false,
    lastQuery: '',
    results: [],
    queryHistory: [],
    hotQaList: [],
    allFaqList: [],
    showQaModal: false,
    showAllFaqModal: false,
    modalQa: {},


    categories: [
      { id: 'all', label: '全部' },
      { id: 'BOI', label: 'BOI' },
      { id: 'DBD', label: 'DBD' },
      { id: 'สรรพากร', label: '税务局' },
      { id: 'กรมโรงงาน', label: '工厂局' },
      { id: 'ตม. / วีซ่า', label: '签证' },
      { id: 'EEC', label: 'EEC' },
    ],

    agencies: [
      { id: 'BOI', icon: '🏢', name: 'BOI', desc: '投资促进委员会' },
      { id: 'DBD', icon: '📋', name: 'DBD', desc: '商业发展厅' },
      { id: 'กรมโรงงาน', icon: '🏭', name: '工厂局 (DIW)', desc: '工厂许可证 รง.4' },
      { id: 'สรรพากร', icon: '💰', name: '税务局', desc: '企业所得税、VAT、WHT' },
      { id: 'ศุลกากร', icon: '🚢', name: '海关', desc: '进出口、Free Zone' },
      { id: 'กนอ. / IEAT', icon: '🏗️', name: 'กนอ. (IEAT)', desc: '工业区管理局' },
      { id: 'EEC', icon: '⚡', name: 'EEC', desc: '东部经济走廊' },
      { id: 'กรมที่ดิน', icon: '🗺️', name: '土地局', desc: '地契、土地转让' },
      { id: 'ธนาคารแห่งประเทศไทย', icon: '🏦', name: '泰国央行 (BOT)', desc: '外汇转账' },
      { id: 'กรมแรงงาน / Work Permit', icon: '👷', name: '劳工局', desc: '工作许可证' },
      { id: 'ตม. / วีซ่า', icon: '✈️', name: '移民局', desc: 'Non-B 签证' },
      { id: 'ประกันสังคม', icon: '🛡️', name: '社保局 (SSO)', desc: '雇主注册' },
      { id: 'อย. / FDA', icon: '💊', name: 'อย. (FDA)', desc: '食品药品许可证' },
      { id: 'กรมการค้าต่างประเทศ', icon: '📦', name: '对外贸易厅', desc: '进出口许可证' },
      { id: 'การไฟฟ้า (PEA/MEA)', icon: '⚡', name: '电力局 (PEA/MEA)', desc: '工厂用电申请' },
      { id: 'PDPA', icon: '🔒', name: 'PDPA', desc: '个人数据保护法' },
      { id: 'กรมทรัพยากรน้ำบาดาล', icon: '🌊', name: '地下水局', desc: '工厂打井' },
      { id: 'EIA / สผ.', icon: '🌿', name: 'EIA / สผ.', desc: '环境影响评估' },
      { id: 'ผังเมือง', icon: '🗺️', name: '城市规划', desc: '土地颜色分区' },
      { id: 'FBC / ธุรกิจต่างด้าว', icon: '🌐', name: 'FBC', desc: 'Foreign Business Certificate' },
      { id: 'FBL / ใบอนุญาตต่างด้าว', icon: '📄', name: 'FBL', desc: 'Foreign Business License' },
      { id: 'TISI / มอก.', icon: '✅', name: 'TISI / มอก.', desc: '工业产品标准' },
      { id: 'กรมโรงงาน / DPIM', icon: '🏭', name: 'DPIM', desc: '基础工业与矿业厅' },
      { id: 'องค์กรปกครองส่วนท้องถิ่น', icon: '🏛️', name: '地方政府 (อปท.)', desc: '地方行政机构' },
    ],
  },

  onLoad(options) {
    this.loadHistory();
    this.loadHotQa();
    if (options && options.autoSearch) {
      const query = decodeURIComponent(options.autoSearch);
      this.setData({ searchVal: query }, () => {
        this.doSearch(query);
      });
    }
  },

  loadHistory() {
    const history = wx.getStorageSync('guide_query_history') || [];
    this.setData({ queryHistory: history });
  },

  saveHistory(query) {
    let history = wx.getStorageSync('guide_query_history') || [];
    history = history.filter(h => h.query !== query);
    history.unshift({ id: Date.now(), query, time: '刚刚' });
    history = history.slice(0, 10);
    wx.setStorageSync('guide_query_history', history);
    this.setData({ queryHistory: history });
  },

  loadHotQa() {
    wx.request({
      url: `${config.apitestAI}/guide/faq-all?lang=zh&limit=6`,
      method: 'GET',
      success: (res) => {
        if (res.data?.status === 'success') {
          this.setData({ hotQaList: res.data.faqs || [] });
        }
      }
    });
  },

  onHotQaTap(e) {
    const { question, answer, agency } = e.currentTarget.dataset;
    this.setData({ showQaModal: true, modalQa: { question, answer, agency } });
  },

  closeQaModal() {
    this.setData({ showQaModal: false, modalQa: {} });
  },
  showAllFaq() {
    // โหลด FAQ ทั้งหมด 10 อัน
    if (this.data.allFaqList.length === 0) {
      wx.request({
        url: `${config.apitestAI}/guide/faq-all?lang=zh&limit=10`,
        method: 'GET',
        success: (res) => {
          if (res.data?.status === 'success') {
            this.setData({ allFaqList: res.data.faqs || [], showAllFaqModal: true });
          }
        }
      });
    } else {
      this.setData({ showAllFaqModal: true });
    }
  },

  closeAllFaq() {
    this.setData({ showAllFaqModal: false });
  },
  noop() {},

  goToAgency(e) {
    const agency = e.currentTarget.dataset.agency;
    this.setData({ showQaModal: false });
    this.doSearch(agency, agency);
  },

  onSearchInput(e) {
    this.setData({ searchVal: e.detail.value });
  },

  onSearchSubmit() {
    const query = this.data.searchVal.trim();
    if (!query) return;
    this.doSearch(query);
  },

  onHistoryTap(e) {
    const query = e.currentTarget.dataset.query;
    this.setData({ searchVal: query });
    this.doSearch(query);
  },

  onAgencyTap(e) {
    const { id, label } = e.currentTarget.dataset;
    const query = label || id;
    this.setData({ searchVal: query, selectedCategory: id });
    this.doSearch(query, id);
  },

  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ selectedCategory: id });
    if (this.data.hasSearched && this.data.lastQuery) {
      this.doSearch(this.data.lastQuery, id !== 'all' ? id : '');
    }
  },

  clearHistory() {
    wx.showModal({
      title: '清除记录',
      content: '确认清除所有查询记录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('guide_query_history');
          this.setData({ queryHistory: [] });
        }
      }
    });
  },

  doSearch(query, categoryOverride) {
    this.saveHistory(query);
    this.setData({ hasSearched: true, isLoading: true, lastQuery: query, results: [] });

    const jwtToken = app.globalData?.token || wx.getStorageSync('usersdetail')?.data?.token || '';
    const category = categoryOverride !== undefined
      ? categoryOverride
      : (this.data.selectedCategory !== 'all' ? this.data.selectedCategory : '');

    wx.request({
      url: `${config.apitestAI}/guide/search`,
      method: 'POST',
      header: { 'content-type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
      data: { query, category, user_type: 'Agent' },
      success: (res) => {
        if (res.data?.status === 'success') {
          this.setData({ isLoading: false, results: res.data.results || [] });
        } else {
          this.handleSearchError();
        }
      },
      fail: () => this.handleSearchError()
    });
  },

  handleSearchError() {
    this.setData({ isLoading: false });
    wx.showToast({ title: '搜索失败，请重试', icon: 'none' });
  },

  onResultTap(e) {
    const item = e.currentTarget.dataset.item;
    const contentEncoded = encodeURIComponent((item.content || '').substring(0, 500));
    const pages = getCurrentPages();
    const url = `../guidedetail/guidedetail?id=${item.id}&query=${encodeURIComponent(this.data.lastQuery)}&title=${encodeURIComponent(item.title)}&agency=${encodeURIComponent(item.agency)}&content=${contentEncoded}`;
    if (pages.length >= 9) {
      wx.redirectTo({ url });
    } else {
      wx.navigateTo({ url });
    }
  },

  onSearchClear() {
    this.setData({ searchVal: '', hasSearched: false, results: [], lastQuery: '', selectedCategory: 'all' });
  }
});