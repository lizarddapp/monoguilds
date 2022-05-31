// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./interfaces/IPiece.sol";
import "./Random.sol";
import "./GM.sol";
import "./interfaces/IProfile.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract PieceAction is PausableUpgradeable, ReentrancyGuardUpgradeable, GM, Random, OwnableUpgradeable {
    error MaximumMintSupplyReached();
    error AmountNotMatched();
    using SafeMathUpgradeable for uint256;
    uint256 public currentTokenId;
    address public pieceAddress;
    address public adminAddress;
    address public founderAddress;
    address public profileAddress;
    uint256 public constant MAX_TOKEN_ID = 5000;
    uint256 public mintPrice;
    bool public pauseReveal;
    enum RARITY {
        UNREVEALED,
        COMMON,
        UNCOMMON,
        RARE,
        LEGENDARY
    }
    /**
    common - 60%
    uncommon - 20%
    rare - 15%
    legendary - 5%
     */
    uint256[] public PIECE_RARITY_RATE;

    struct Attribute {
        uint256 level;
        uint256 gen;
        RARITY rarity;
        bool revealed;
        uint256 strength;
        uint256 speed;
        uint256 luck;
        uint256 agility;
    }

    struct Stat {
        uint256 xp;
        uint256 stepOn;
        uint256 lastMoveAt;
        uint256 battleWon;
        uint256 battleLose;
    }

    mapping(uint256 => Attribute) public attributes;
    mapping(uint256 => Stat) public stats;

    function initialize(
        address _adminAddress,
        address _founderAddress,
        address _pieceAddress,
        address _profileAddress
    ) public initializer {
        __Pausable_init();
        Random.setup(1001);
        pieceAddress = _pieceAddress;
        founderAddress = _founderAddress;
        PIECE_RARITY_RATE = [65, 20, 10, 5];
        adminAddress = _adminAddress;
        profileAddress = _profileAddress;
        GM.init(_adminAddress);
        pauseReveal = true;
        mintPrice = 1 ether;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function setMintPrice(uint256 _mintPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mintPrice = _mintPrice;
    }

    function setPauseReveal(bool _isPause) external onlyRole(DEFAULT_ADMIN_ROLE) {
        pauseReveal = _isPause;
    }

    function mint(uint256 tokenId) internal {
        IPiece(pieceAddress).mint(msg.sender, tokenId);
    }

    function mintBatch(uint256 count) external payable whenNotPaused {
        if (currentTokenId + count > MAX_TOKEN_ID) revert MaximumMintSupplyReached();
        if (count * mintPrice != msg.value) revert AmountNotMatched();
        require(count <= 10, "maximum count exceeded");
        for (uint256 i = 0; i < count; i++) {
            currentTokenId++;
            mint(currentTokenId);
        }
    }

    function assignAttr(uint256 _tokenId) private {
        RARITY rarity;
        uint256 minAttr;
        uint256 maxAttr;

        rarity = RARITY(Random.getRandomNumberFromRate(PIECE_RARITY_RATE));

        if (rarity == RARITY.COMMON) {
            minAttr = 1;
            maxAttr = 3;
        } else if (rarity == RARITY.UNCOMMON) {
            minAttr = 2;
            maxAttr = 4;
        } else if (rarity == RARITY.RARE) {
            minAttr = 3;
            maxAttr = 5;
        } else if (rarity == RARITY.LEGENDARY) {
            minAttr = 4;
            maxAttr = 6;
        }
        uint256 strength = getRandomNumber(minAttr, maxAttr);
        uint256 speed = getRandomNumber(minAttr, maxAttr);
        uint256 luck = getRandomNumber(minAttr, maxAttr);
        uint256 agility = getRandomNumber(minAttr, maxAttr);

        attributes[_tokenId] = Attribute(1, 0, rarity, true, strength, speed, luck, agility);
        emit PieceReveal(_tokenId, msg.sender, uint256(rarity), strength, speed, luck, agility);
    }

    function reveal(uint256 _tokenId) external onlyPieceOwner(_tokenId) {
        require(IProfile(profileAddress).profileExist(msg.sender), "no profile");
        require(pauseReveal == false, "reveal paused");
        require(!attributes[_tokenId].revealed, "already revealed");
        assignAttr(_tokenId);
    }

    function getPieceList(uint256 _from, uint256 _to) external view returns (Attribute[] memory) {
        uint256 totalSupply = IPiece(pieceAddress).totalSupply();
        if (totalSupply <= _from || _from > _to || totalSupply == 0) {
            return new Attribute[](0);
        }
        uint256 to = (totalSupply - 1 > _to) ? _to : totalSupply - 1;
        Attribute[] memory temp = new Attribute[](to - _from + 1);

        for (uint256 i = _from; i <= to; i++) {
            temp[i - _from] = attributes[i];
        }
        return temp;
    }

    modifier onlyPieceOwner(uint256 tokenId) {
        require(IPiece(pieceAddress).ownerOf(tokenId) == msg.sender, "You are not Piece owner");
        _;
    }

    function move(uint256 _tokenId, uint256 _steps) external onlyPieceOwner(_tokenId) whenNotPaused {
        require(_steps > 0 && _steps <= attributes[_tokenId].speed, "Invalid step");
        uint256 to = stats[_tokenId].stepOn + _steps;
        uint256 xpEarned = Random.getRandomNumber(_steps, _steps + 5);
        stats[_tokenId].xp += xpEarned;
        stats[_tokenId].lastMoveAt = block.timestamp;
        emit PieceMoved(_tokenId, stats[_tokenId].stepOn, _steps, xpEarned);
        if (stats[_tokenId].stepOn <= 40) {
            stats[_tokenId].stepOn = to;
        } else {
            stats[_tokenId].stepOn = to - 40;
        }
    }

    function withdrawValue(uint256 value) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance != 0, "Nothing to withdraw");
        (bool success, ) = payable(adminAddress).call{value: value}("");
        require(success, "Withdraw failed");
    }

    function withdrawToken(
        address _tokenContract,
        address _whereTo,
        uint256 _amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20Upgradeable tokenContract = IERC20Upgradeable(_tokenContract);
        tokenContract.transfer(_whereTo, _amount);
    }

    /** level */
    function levelUp(uint256 _tokenId) external onlyPieceOwner(_tokenId) {
        uint256 _level = attributes[_tokenId].level;
        uint256 _xpRequired = xpRequired(_level);
        stats[_tokenId].xp -= _xpRequired;
        _level = _level + 1;
        emit LeveledUp(msg.sender, _tokenId, attributes[_tokenId].level);
    }

    function xpRequired(uint256 _currentLevel) public pure returns (uint256 xpToNextLevel) {
        xpToNextLevel = _currentLevel * 100;
        for (uint256 i = 1; i < _currentLevel; i++) {
            xpToNextLevel += _currentLevel * 100;
        }
    }

    /** Event */

    event PieceReveal(
        uint256 indexed tokenId,
        address indexed receiver,
        uint256 indexed rarity,
        uint256 strength,
        uint256 speed,
        uint256 luck,
        uint256 agility
    );

    event PieceMoved(uint256 indexed tokenId, uint256 moveFrom, uint256 steps, uint256 xpEarned);
    event LeveledUp(address indexed owner, uint256 tokenId, uint256 level);
}

/**

234992
235504
234685
233615

*/
