// pages/filtersearch/filtersearch.js
const app = getApp();
const config = require("../../config");

Page({
    data: {
        language: config.language,
        SellType: 1,
        active: 0,
        ShowColapseSearchDetail: ['1'],
        activeNames: ['1'],
        RecentDisplay: [],
        BookmarkDisplay: [],
        keyword: "",
        ShowBuildingPrice : false,
        filterdata: {
            PropertyType: 0,
            PropertyTypeName: "",
            IEAT: 0,
            IEATText: "",
            Color: 0,
            LandSizeStart : '',
            LandSizeEnd : '',
            PriceStart : '',
            PriceEnd : '',
            BuildingStart : '',
            BuildingEnd : '',
        },
        Search_fun: [
            // {
            //     id: 1,
            //     icon: 'orders-o',
            //     name: config.language == "en" ? "Search all" : "搜索全部",
            // },
            {
                id: 2,
                icon: '',
                name: config.language == "en" ? "Near Location" : "附近位置",
            },
            // {
            //   id: 3,
            //   icon: 'location-o',
            //   name: config.language == "en" ? "Near me" : "距离我 30 公里",
            // },
            {
                id: 4,
                icon: '',
                name: config.language == "en" ? "Search By province and district" : "按省份和地区搜索",
            },
            {
                id: 5,
                icon: '',
                name: config.language == "en" ? "Search #no or Asset Name" : "搜索编号或资产名称",
            },
        ],
        DataPropType: [{
                id: 0,
                name: config.language == "en" ? "All" : "全部"
            },
            {
                id: 1,
                name: config.language == "en" ? "Land" : "土地"
            },
            {
                id: 2,
                name: config.language == "en" ? "Warehouse" : "仓库"
            },
            {
                id: 3,
                name: config.language == "en" ? "Factory" : "工厂"
            }
        ],
        DataIEAT: [{
                id: '0',
                name: config.language == "en" ? "All" : "全部"
            },
            {
                id: '2',
                name: config.language == "en" ? "IEAT" : "工业区内"
            },
            {
                id: '1',
                name: config.language == "en" ? "Non IEAT" : "工业区外"
            }
        ],
        DataColor: [
            {
                id: "0",
                name: config.language == "en" ? "All" : "全部",
                select: true,
            },
            {
                id: "1",
                name: config.language == "en" ? "Purple zone" : "紫色",
                select: false,
            },
            {
                id: "2",
                name: config.language == "en" ? "Yellow zone" : "黄色",
                select: false,
            },
            {
                id: "3",
                name: config.language == "en" ? "Green zone" : "绿色",
                select: false,
            },
            {
                id: "4",
                name: config.language == "en" ? "Light Purple zone" : "浅紫色",
                select: false,
            },
            {
                id: "5",
                name: config.language == "en" ? "Orange zone" : "橙色",
                select: false,
            },
            {
                id: "6",
                name: config.language == "en" ? "Brown zone" : "棕色的",
                select: false,
            },
            {
                id: "7",
                name: config.language == "en" ? "Light Brown zone" : "浅棕色",
                select: false,
            },
            {
                id: "8",
                name: config.language == "en" ? "Red zone" : "红色的",
                select: false,
            },
            {
                id: "9",
                name: config.language == "en" ? "Blue zone" : "蓝色的",
                select: false,
            },
            {
                id: "10",
                name: config.language == "en" ? "Green diagonal zone" : "绿色对角线",
                select: false,
            },
            {
                id: "11",
                name: config.language == "en" ? "Gray zone" : "灰色的",
                select: false,
            },
            {
                id: "12",
                name: config.language == "en" ? "Olive green zone" : "橄榄绿",
                select: false,
            },
            {
                id: "13",
                name: config.language == "en" ? "Pink zone" : "粉色的",
                select: false,
            }
        ],
    },
    async onLoad() {

    },

    async onShow() {
        const dataRecent = await app.localStorageGet('recentsearch')
        if (dataRecent != "no data search") {
            dataRecent.data = dataRecent.data.slice().reverse()
            this.setData({
                RecentDisplay: dataRecent.data
            })
        }

        const dataBookmark = await app.localStorageGet('Bookmark')
        if (dataBookmark != "no data search") {
            dataBookmark.data = dataBookmark.data.slice().reverse()
            this.setData({
                BookmarkDisplay: dataBookmark.data
            })
        }
    },

    onChangeHistoryCollapse(event) {
        this.setData({
            activeNames: event.detail,
        });
    },

    onChangeSearchDetailCollapse(event) {
        this.setData({
            ShowColapseSearchDetail: event.detail,
        });
    },

    onActiveChange(e) {
        this.setData({
            SellType: e.detail.SellType
        });
    },

    onInputKeyword(e) {
        let data = e.detail.value
        this.setData({
            keyword: data
        })
    },

    NextToSearch(e) {
        let indexlist = e.currentTarget.dataset.index
        const datalist = this.data.RecentDisplay[indexlist]
        app.MainStackScreen(datalist)
    },

    NextToSearchBookmark(e) {
        let indexlist = e.currentTarget.dataset.index
        const datalist = this.data.BookmarkDisplay[indexlist]
        app.MainStackScreen(datalist)
    },

    btnNextToSearchResult(e) {
        let id = e.currentTarget.dataset.id
        let url = id == 1 ? `/pages/search/search?selltype=${this.data.SellType}` :
            id == 2 ? `/pages/nearlocation/nearlocation?selltype=${this.data.SellType}` :
            id == 3 ? `/pages/search/search` :
            id == 4 ? `/pages/province/province?selltype=${this.data.SellType}` :
            id == 5 ? `/pages/seachasset/searchasset` :
            "";
        wx.navigateTo({
            url: url
        })
    },

    btnNexttoSearchKeyword() {
        wx.navigateTo({
            url: `/pages/search/search?selltype=${this.data.SellType}&keyword=${this.data.keyword}`,
        })
    },

    btnNextToSearchDetail(){
        let Color = this.data.filterdata.Color
        let IEAT = this.data.filterdata.IEAT
        let LandSizeStart = this.data.filterdata.LandSizeStart
        let LandSizeEnd = this.data.filterdata.LandSizeEnd
        let BuildingStart = this.data.filterdata.BuildingStart
        let BuildingEnd = this.data.filterdata.BuildingEnd
        let PriceStart = this.data.filterdata.PriceStart
        let PriceEnd = this.data.filterdata.PriceEnd
        let PropertyType = this.data.filterdata.PropertyType
        
        Color = Color != 0 ? `&Color=${Color}` : '';
        IEAT = IEAT != 0 ? `&IEAT=${IEAT}` : '';
        LandSizeStart = LandSizeStart != "" ? `&LandSizeStart=${LandSizeStart}` : '';
        LandSizeEnd = LandSizeEnd != "" ? `&LandSizeEnd=${LandSizeEnd}` : '';
        BuildingStart = BuildingStart != "" ? `&BuildingStart=${BuildingStart}` : '';
        BuildingEnd = BuildingEnd != "" ? `&BuildingEnd=${BuildingEnd}` : '';
        PriceStart = PriceStart != "" ? `&PriceStart=${PriceStart}` : '';
        PriceEnd = PriceEnd != "" ? `&PriceEnd=${PriceEnd}` : '';
        PropertyType = PropertyType != 0 ? `&PropertyType=${PropertyType}` : '';

        let urldata = `/pages/search/search?selltype=${this.data.SellType}${Color}${IEAT}${LandSizeStart}${LandSizeEnd}${PriceStart}${PriceEnd}${PropertyType}${BuildingStart}${BuildingEnd}`
        wx.navigateTo({
            url: urldata,
        })
    },

    selectProperty(e) {
        const dataId = e.target.dataset.id
        const dataText = e.target.dataset.text

        if (dataId == 2 || dataId == 3){
            this.setData({
                ShowBuildingPrice : true
            })
        }else{
            this.setData({
                ShowBuildingPrice : false
            })
        }

        this.setData({
            'filterdata.PropertyType': dataId,
            'filterdata.PropertyTypeName': dataText
        })
    },
    selectIEAT(e) {
        const dataId = e.target.dataset.id
        const dataText = e.target.dataset.text
        this.setData({
            'filterdata.IEAT': dataId,
            'filterdata.IEATText': dataText
        })
    },
    selectColor(e) {
        const id = String(e.currentTarget.dataset.id);
        let DataColor = this.data.DataColor;

        // ถ้ากด "0" → เคลียร์ทั้งหมด เหลือค่า "0" 
        if (id === "0") {
            DataColor = DataColor.map(item => {
                item.select = item.id === "0"; // ให้ "0" เป็น select = true, อื่น ๆ = false
                return item;
            });

            this.setData({
                DataColor,
                'filterdata.Color': ["0"] // เก็บแค่ "0"
            });
            return;
        }

        // toggle สีอื่น ๆ
        DataColor = DataColor.map(item => {
            if (item.id === id) {
                item.select = !item.select;
            } else if (item.id === "0") {
                // ถ้าเลือกสีอื่น ๆ ให้ "0" auto deselect
                item.select = false;
            }
            return item;
        });

        // สร้าง array ของสีที่เลือก
        const selectedArr = DataColor
            .filter(item => item.select)
            .map(item => item.id);

        this.setData({
            DataColor,
            'filterdata.Color': selectedArr
        });
    },
    onInputLandStart(e) {
        let val = e.detail.value
        val = val.replace(/,/g, "")
        val = parseInt(val) || 0
        this.setData({
            'filterdata.LandSizeStart': val.toLocaleString('th-TH')
        });
    },
    onInputLandEnd(e) {
        let val = e.detail.value
        val = val.replace(/,/g, "")
        val = parseInt(val) || 0
        this.setData({
            'filterdata.LandSizeEnd': val.toLocaleString('th-TH')
        });
    },
    onInputStart(e) {
        let val = e.detail.value
        val = val.replace(/,/g, "")
        val = parseInt(val) || 0
        this.setData({
            'filterdata.PriceStart': val.toLocaleString('th-TH')
        });
    },
    onInputEnd(e) {
        let val = e.detail.value
        val = val.replace(/,/g, "")
        val = parseInt(val) || 0
        this.setData({
            'filterdata.PriceEnd': val.toLocaleString('th-TH')
        });
    },
    onInputBuildingStart(e) {
        let val = e.detail.value
        val = val.replace(/,/g, "")
        val = parseInt(val) || 0
        this.setData({
          'filterdata.BuildingStart': val.toLocaleString('th-TH')
        });
      },
      onInputBuildingEnd(e) {
        let val = e.detail.value
        val = val.replace(/,/g, "")
        val = parseInt(val) || 0
        this.setData({
          'filterdata.BuildingEnd': val.toLocaleString('th-TH')
        });
      },
    
})