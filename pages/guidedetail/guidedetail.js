const app = getApp();
const config = require("../../config");

Page({
  data: {
    articleId: '',
    agency: '',
    articleTitle: '',
    initialQuery: '',
    contentCache: '',
    articleBody: '',
    updatedAt: '',
    relatedTopics: [],
    suggestedQuestions: [],
    isLoadingArticle: true,
    isLoadingAnswer: false,
    qaList: [],
    faqList: [],
    inputVal: '',
    scrollTo: '',
  },

  onLoad(options) {
    const { id, query, title, agency, content } = options;
    this.setData({
      articleId: id || '',
      initialQuery: decodeURIComponent(query || ''),
      articleTitle: decodeURIComponent(title || ''),
      agency: decodeURIComponent(agency || ''),
      contentCache: content ? decodeURIComponent(content) : '',
    });
    this.loadArticle();
    if (agency) {
      this.loadFaq(decodeURIComponent(agency));
    }
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({ delta: 1 });
    } else {
      wx.redirectTo({ url: '../guideresource/guideresource' });
    }
  },

  loadArticle() {
    const jwtToken = this.getToken();
    wx.request({
      url: `${config.apitestAI}/guide/article`,
      method: 'POST',
      header: { 'content-type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
      data: {
        article_id: this.data.articleId,
        query: this.data.initialQuery,
        agency: this.data.agency,
        content_cache: this.data.contentCache,
        user_type: 'Agent'
      },
      success: (res) => {
        if (res.data?.status === 'success') {
          this.setData({
            isLoadingArticle: false,
            articleBody: res.data.body || '',
            articleTitle: res.data.title || this.data.articleTitle,
            updatedAt: res.data.updated_at || this.formatDate(),
            relatedTopics: res.data.related_topics || [],
            suggestedQuestions: res.data.suggested_questions || [],
          }, () => {
            // โหลด FAQ หลังบทความเสร็จแล้วค่อยโหลด — ไม่ block UI
            if (this.data.agency) {
              this.loadFaq(this.data.agency);
            }
          });
        } else {
          this.handleArticleError();
        }
      },
      fail: () => this.handleArticleError()
    });
  },

  handleArticleError() {
    this.setData({
      isLoadingArticle: false,
      articleBody: '数据加载失败，请稍后重试。',
      updatedAt: this.formatDate(),
      suggestedQuestions: [
        `${this.data.agency}需要哪些文件？`,
        `${this.data.agency}的办理流程？`,
        `${this.data.agency}需要多长时间？`,
      ],
    });
  },

  loadFaq(agency) {
    const jwtToken = this.getToken();
    wx.request({
      url: `${config.apitestAI}/guide/faq/${encodeURIComponent(agency)}?lang=zh&limit=8`,
      method: 'GET',
      header: { 'Authorization': `Bearer ${jwtToken}` },
      success: (res) => {
        if (res.data?.status === 'success' && res.data.faqs?.length > 0) {
          this.setData({ faqList: res.data.faqs });
        }
      }
    });
  },

  onInput(e) {
    this.setData({ inputVal: e.detail.value });
  },

  handleSend() {
    const question = this.data.inputVal.trim();
    if (!question || this.data.isLoadingAnswer) return;

    const qaId = Date.now();
    const updatedList = [...this.data.qaList, {
      id: qaId, question, answer: '', source: '', isLoading: true
    }];

    this.setData({ qaList: updatedList, inputVal: '', isLoadingAnswer: true, scrollTo: `qa-${qaId}` });
    this.askQuestion(question, qaId);
  },

  askQuestion(question, qaId) {
    const jwtToken = this.getToken();
    wx.request({
      url: `${config.apitestAI}/guide/ask`,
      method: 'POST',
      header: { 'content-type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
      data: {
        question,
        agency: this.data.agency,
        article_id: this.data.articleId,
        context_title: this.data.articleTitle,
        token: jwtToken,
        user_type: 'Agent'
      },
      success: (res) => {
        if (res.data?.status === 'success') {
          this.updateQaAnswer(qaId, res.data.answer, res.data.source || '');
        } else {
          this.updateQaAnswer(qaId, '抱歉，暂时无法获取信息，请稍后再试。', '');
        }
      },
      fail: () => this.updateQaAnswer(qaId, '连接失败，请检查网络后重试。', '')
    });
  },

  updateQaAnswer(qaId, answer, source) {
    const qaList = this.data.qaList.map(item =>
      item.id === qaId ? { ...item, answer, source, isLoading: false } : item
    );
    this.setData({ qaList, isLoadingAnswer: false, scrollTo: `qa-${qaId}` });
  },

  onSuggestedTap(e) {
    const q = e.currentTarget.dataset.q;
    this.setData({ inputVal: q }, () => this.handleSend());
  },

  onRelatedTap(e) {
    const query = e.currentTarget.dataset.query;
    if (!query) return;
    wx.navigateTo({ url: `../guideresource/guideresource?autoSearch=${encodeURIComponent(query)}` });
  },

  voteHelpful(e) {
    const qaId = e.currentTarget.dataset.id;
    const jwtToken = this.getToken();
    wx.request({
      url: `${config.apitestAI}/guide/vote`,
      method: 'POST',
      header: { 'content-type': 'application/json', 'Authorization': `Bearer ${jwtToken}` },
      data: { qa_id: parseInt(qaId) },
      success: () => {
        const faqList = this.data.faqList.map(f =>
          f.id === qaId ? { ...f, helpful_count: (f.helpful_count || 0) + 1 } : f
        );
        this.setData({ faqList });
        wx.showToast({ title: '👍 谢谢', icon: 'none' });
      }
    });
  },

  getToken() {
    try {
      const res = wx.getStorageSync('usersdetail');
      if (res && res !== 'no data search') {
        return res.token || res.data?.token || '';
      }
      return '';
    } catch (e) { return ''; }
  },

  formatDate() {
    const d = new Date();
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  },
});