// This is a generated file! Please edit source .ksy file and use kaitai-struct-compiler to rebuild

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['kaitai-struct/KaitaiStream', 'LainCompress'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('kaitai-struct/KaitaiStream'), require('./lain_compress.js'));
  } else {
    root.Lapk = factory(root.KaitaiStream, root.LainCompress);
  }
}(this, function (KaitaiStream, LainCompress) {
var Lapk = (function() {
  function Lapk(_io, _parent, _root) {
    this._io = _io;
    this._parent = _parent;
    this._root = _root || this;

    this._read();
  }
  Lapk.prototype._read = function() {
    this.magic = this._io.readBytes(4);
    if (!((KaitaiStream.byteArrayCompare(this.magic, [108, 97, 112, 107]) == 0))) {
      throw new KaitaiStream.ValidationNotEqualError([108, 97, 112, 107], this.magic, this._io, "/seq/0");
    }
    this.lapkSize = this._io.readU4le();
    this._raw_data = this._io.readBytes(this.lapkSize);
    var _io__raw_data = new KaitaiStream(this._raw_data);
    this.data = new LapkData(_io__raw_data, this, this._root);
  }

  var CellHeader = Lapk.CellHeader = (function() {
    function CellHeader(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    CellHeader.prototype._read = function() {
      this.cellOffset = this._io.readU4le();
      this.negativeXPosition = this._io.readU2le();
      this.negativeYPosition = this._io.readU2le();
      this.unknown = this._io.readU4le();
    }

    return CellHeader;
  })();

  var CellData = Lapk.CellData = (function() {
    function CellData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    CellData.prototype._read = function() {
      this.width = this._io.readU2le();
      this.height = this._io.readU2le();
      this.chrominanceQuantisationScale = this._io.readU2le();
      this.luminanceQuantisationScale = this._io.readU2le();
      this.imageDataSize = this._io.readU4le();
      this.runLengthCodeCount = this._io.readU4le();
      this.imageData = this._io.readBytes((this.imageDataSize - 4));
      this._raw_bitMask = this._io.readBytesFull();
      var _process = new LainCompress();
      this.bitMask = _process.decode(this._raw_bitMask);
    }

    return CellData;
  })();

  var LapkData = Lapk.LapkData = (function() {
    function LapkData(_io, _parent, _root) {
      this._io = _io;
      this._parent = _parent;
      this._root = _root || this;

      this._read();
    }
    LapkData.prototype._read = function() {
      this.cellCount = this._io.readU4le();
      this.cellHeaders = new Array(this.cellCount);
      for (var i = 0; i < this.cellCount; i++) {
        this.cellHeaders[i] = new CellHeader(this._io, this, this._root);
      }
      this._raw_cellData = new Array(this.cellCount);
      this.cellData = new Array(this.cellCount);
      for (var i = 0; i < this.cellCount; i++) {
        this._raw_cellData[i] = this._io.readBytes((i == (this.cellCount - 1) ? (((this._parent.lapkSize - 4) - (this.cellCount * 12)) - this.cellHeaders[i].cellOffset) : (this.cellHeaders[(i + 1)].cellOffset - this.cellHeaders[i].cellOffset)));
        var _io__raw_cellData = new KaitaiStream(this._raw_cellData[i]);
        this.cellData[i] = new CellData(_io__raw_cellData, this, this._root);
      }
    }

    return LapkData;
  })();

  return Lapk;
})();
return Lapk;
}));
